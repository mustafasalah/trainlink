"use server";

import mongoose from "mongoose";
import Application from "../models/Application";
import Job from "../models/Job";
import connectDB from "../DBconnection";
import { getAuthUser } from "../auth";
import {
    uploadFileToSupabase,
    removeFromSupabase,
} from "@/app/lib/supabaseStorage";

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

    // 1) Upload files to Supabase first
    let resume = null;
    let cover = null;

    try {
        resume = await uploadFileToSupabase({
            file: resumeFile,
            folder: "applications/resumes",
            fileBaseName: `${studentId}-${jobId}-resume`,
            contentTypeFallback: "application/pdf",
        });

        cover = await uploadFileToSupabase({
            file: coverLetterFile,
            folder: "applications/coverletters",
            fileBaseName: `${studentId}-${jobId}-coverletter`,
            contentTypeFallback: "application/pdf",
        });
    } catch (uploadError) {
        console.error("Supabase upload failed:", uploadError);
        await removeFromSupabase([resume?.storagePath, cover?.storagePath]);
        return {
            success: false,
            message: "File upload failed. Please try again.",
        };
    }

    // 2) Transaction: create application + increment counter
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
                    resumeUrl: resume.publicUrl,
                    coverLetterUrl: cover.publicUrl,
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

        // cleanup uploaded files if DB fails
        await removeFromSupabase([resume?.storagePath, cover?.storagePath]);

        return {
            success: false,
            message: "Failed to save application. Please try again.",
        };
    }
}
