"use server";

import mongoose from "mongoose";
import Application from "../models/Application";
import Job from "../models/Job";
import path from "path";
import { writeFile, unlink } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import connectDB from "../DBconnection";
import { getAuthUser } from "../auth";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function applyForJob(formData) {
    await connectDB();

    const loggedUser = await getAuthUser();
    if (!loggedUser || loggedUser.role !== "Student") {
        return {
            success: false,
            message: "Unauthorized: Only students can apply.",
        };
    }

    const studentId = loggedUser.id;
    const jobId = formData.get("jobId");
    const resumeFile = formData.get("resume");
    const coverLetterFile = formData.get("coverLetter");

    if (!jobId || !resumeFile || !coverLetterFile) {
        return {
            success: false,
            message:
                "Missing required form fields (Job ID, Resume, Cover Letter).",
        };
    }

    // Check job exists
    const jobExists = await Job.findById(jobId).select("_id appliedCounter");
    if (!jobExists) {
        return { success: false, message: "The specified job does not exist." };
    }

    // Block duplicate apply (except rejected)
    const existingApplication = await Application.findOne({
        student: studentId,
        job: jobId,
    });

    if (existingApplication && existingApplication.status !== "Rejected") {
        return {
            success: false,
            message: "You have already applied for this job.",
        };
    }

    let resumeUrl = "";
    let coverLetterUrl = "";

    try {
        // Upload Resume
        if (!(resumeFile instanceof File) || resumeFile.size === 0) {
            return {
                success: false,
                message: "Resume file is missing or invalid.",
            };
        }

        const resumeBytes = await resumeFile.arrayBuffer();
        const resumeBuffer = Buffer.from(resumeBytes);
        const resumeFileName = `${uuidv4()}-${resumeFile.name.replace(
            /\s/g,
            "_"
        )}`;
        await writeFile(path.join(UPLOADS_DIR, resumeFileName), resumeBuffer);
        resumeUrl = `/uploads/${resumeFileName}`;

        // Upload Cover Letter
        if (!(coverLetterFile instanceof File) || coverLetterFile.size === 0) {
            // cleanup resume if cover missing
            await unlink(path.join(process.cwd(), "public", resumeUrl));
            return {
                success: false,
                message: "Cover letter file is missing or invalid.",
            };
        }

        const clBytes = await coverLetterFile.arrayBuffer();
        const clBuffer = Buffer.from(clBytes);
        const clFileName = `${uuidv4()}-${coverLetterFile.name.replace(
            /\s/g,
            "_"
        )}`;
        await writeFile(path.join(UPLOADS_DIR, clFileName), clBuffer);
        coverLetterUrl = `/uploads/${clFileName}`;
    } catch (uploadError) {
        console.error("File upload failed:", uploadError);
        return {
            success: false,
            message: "File upload failed. Please try again.",
        };
    }

    // Transaction: create application + increment counter
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const newApplication = await Application.create(
            [
                {
                    student: studentId,
                    job: jobId,
                    applicationDate: new Date(),
                    status: "Pending",
                    acceptedByAdmin: false,
                    resumeUrl,
                    coverLetterUrl,
                    notes: "",
                },
            ],
            { session }
        );

        // increment appliedCounter safely
        await Job.updateOne(
            { _id: jobId },
            { $inc: { appliedCounter: 1 } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return {
            success: true,
            message: "Application submitted successfully!",
            application: JSON.parse(JSON.stringify(newApplication[0])),
        };
    } catch (dbError) {
        await session.abortTransaction();
        session.endSession();

        console.error("Error saving application to DB:", dbError);

        //  cleanup uploaded files if DB fails
        try {
            if (resumeUrl)
                await unlink(path.join(process.cwd(), "public", resumeUrl));
            if (coverLetterUrl)
                await unlink(
                    path.join(process.cwd(), "public", coverLetterUrl)
                );
        } catch (_) {}

        return {
            success: false,
            message: "Failed to save application. Please try again.",
        };
    }
}
