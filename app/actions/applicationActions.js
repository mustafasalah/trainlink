"use server";

import Application from "../models/Application"; // Your Application model
import Job from "../models/Job"; // Your Job model (to check job existence)
import User from "../models/User"; // Your User model (to verify student)
import path from "path";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid"; // For generating unique file names
import connectDB from "../DBconnection";
import { getAuthUser } from "../auth";

// IMPORTANT: Define your upload directory path.
// For production, replace this with cloud storage logic (S3, Cloudinary etc.)
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Handles the submission of a student's application form.
 * It expects FormData containing:
 * - 'jobId': The ID of the job being applied for.
 * - 'resume': The CV/Resume file.
 * - 'coverLetter': The Cover Letter file.
 *
 * @param {FormData} formData - The form data submitted from the client.
 * @returns {Promise<object>} An object indicating success or failure.
 */
export async function applyForJob(formData) {
    await connectDB(); // Ensure database connection

    let loggedUser;
    try {
        loggedUser = await getAuthUser();
        if (!loggedUser || loggedUser.role !== "Student") {
            return {
                success: false,
                message: "Unauthorized: Only students can apply.",
            };
        }
    } catch (error) {
        console.error("Authentication error during application:", error);
        return { success: false, message: "Authentication failed." };
    }

    const studentId = loggedUser.id; // Get student ID from authenticated user
    const jobId = formData.get("jobId");
    const resumeFile = formData.get("resume");
    const coverLetterFile = formData.get("coverLetter");

    // Basic Validation
    if (!jobId || !resumeFile || !coverLetterFile) {
        return {
            success: false,
            message:
                "Missing required form fields (Job ID, Resume, Cover Letter).",
        };
    }

    // Check if the job exists
    let jobExists;
    try {
        jobExists = await Job.findById(jobId).select("_id");
        if (!jobExists) {
            return {
                success: false,
                message: "The specified job does not exist.",
            };
        }
    } catch (error) {
        console.error("Error checking job existence:", error);
        return { success: false, message: "Error validating job ID." };
    }

    // Check if student has already applied to this job and is not rejected yet
    try {
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
    } catch (error) {
        console.error("Error checking existing application:", error);
        return {
            success: false,
            message: "Error checking previous application.",
        };
    }

    let resumeUrl = "";
    let coverLetterUrl = "";

    try {
        // --- Handle Resume/CV File Upload ---
        if (resumeFile instanceof File) {
            const resumeBytes = await resumeFile.arrayBuffer();
            const resumeBuffer = Buffer.from(resumeBytes);
            const resumeFileName = `${uuidv4()}-${resumeFile.name.replace(
                /\s/g,
                "_"
            )}`; // Use original name with UUID
            const resumeFilePath = path.join(UPLOADS_DIR, resumeFileName);
            await writeFile(resumeFilePath, resumeBuffer);
            resumeUrl = `/uploads/${resumeFileName}`; // Publicly accessible URL
        } else {
            return {
                success: false,
                message: "Resume file is missing or invalid.",
            };
        }

        // --- Handle Cover Letter File Upload ---
        if (coverLetterFile instanceof File) {
            const coverLetterBytes = await coverLetterFile.arrayBuffer();
            const coverLetterBuffer = Buffer.from(coverLetterBytes);
            const coverLetterFileName = `${uuidv4()}-${coverLetterFile.name.replace(
                /\s/g,
                "_"
            )}`;
            const coverLetterFilePath = path.join(
                UPLOADS_DIR,
                coverLetterFileName
            );
            await writeFile(coverLetterFilePath, coverLetterBuffer);
            coverLetterUrl = `/uploads/${coverLetterFileName}`; // Publicly accessible URL
        } else {
            return {
                success: false,
                message: "Cover letter file is missing or invalid.",
            };
        }
    } catch (uploadError) {
        console.error("File upload failed:", uploadError);
        return {
            success: false,
            message: "File upload failed. Please try again.",
        };
    }

    // --- Save Application to MongoDB ---
    try {
        const newApplication = await Application.create({
            student: studentId,
            job: jobId,
            applicationDate: new Date(),
            status: "Pending", // Default status on submission
            acceptedByAdmin: false, // Default to false upon submission
            resumeUrl: resumeUrl,
            coverLetterUrl: coverLetterUrl,
            notes: "", // Or populate from form if you add a notes field
        });

        console.log("Application saved:", newApplication);

        return {
            success: true,
            message: "Application submitted successfully!",
            application: JSON.parse(JSON.stringify(newApplication)),
        };
    } catch (dbError) {
        console.error("Error saving application to DB:", dbError);
        // In a real app, you might want to delete the uploaded files if DB save fails
        return {
            success: false,
            message: "Failed to save application. Please try again.",
        };
    }
}
