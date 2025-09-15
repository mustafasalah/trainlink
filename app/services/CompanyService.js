"use server";

import path from "path";
import { unlink, writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import Company from "../models/Company";
import User from "../models/User";
import connectDB from "../DBconnection";

// Define your upload directory path. For production, this should be a cloud storage bucket.
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
/**
 * Creates a new company document and its owner user, ensuring the user is linked
 * to the newly created company. This operation is atomic via a transaction.
 * @param {object} companyData - The data for the new company.
 * @param {object} userData - The data for the new company owner user.
 * @returns {Promise<{company: object, user: object}>} The newly created company and user documents.
 */

export async function createCompanyAndOwner(companyData, userData, photoFile) {
    await connectDB();

    const session = await mongoose.startSession();
    session.startTransaction();

    let thumbnailUrl = "";

    try {
        // Step 1: Handle file upload first
        if (!(photoFile instanceof File)) {
            throw new Error("Photo file is missing or invalid.");
        }

        const photoBytes = await photoFile.arrayBuffer();
        const photoBuffer = Buffer.from(photoBytes);
        const fileName = `${uuidv4()}-${photoFile.name.replace(/\s/g, "_")}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        await writeFile(filePath, photoBuffer);
        thumbnailUrl = `/uploads/${fileName}`;

        // Step 2: Create the company document with the photo URL
        const newCompany = await Company.create(
            [
                {
                    ...companyData,
                    thumbnailUrl: thumbnailUrl,
                },
            ],
            { session }
        );
        const newCompanyId = newCompany[0]._id;
        const newCompanyName = newCompany[0].name;

        // Step 3: Create the user, linking it to the new company
        const newUser = await User.create(
            [
                {
                    ...userData,
                    role: "Company",
                    companyId: newCompanyId,
                    companyName: newCompanyName,
                },
            ],
            { session }
        );

        // Step 4: Link the company back to the new user's ID
        await Company.updateOne(
            { _id: newCompanyId },
            { owner: newUser[0]._id },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return { company: newCompany[0], user: newUser[0] };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        if (thumbnailUrl) {
            try {
                await unlink(path.join(process.cwd(), "public", thumbnailUrl));
            } catch (unlinkError) {
                console.error("Failed to delete orphaned file:", unlinkError);
            }
        }
        console.error("Error creating company with photo:", error);
        throw new Error("Failed to create company with photo.");
    }
}

/**
 * Deletes a company document and its owner user.
 * The deletion of the owner user is handled by a Mongoose pre-hook on the Company schema.
 * @param {string} companyId - The ID of the company to delete.
 * @returns {Promise<object|null>} The deleted company document.
 */
export async function deleteCompanyAndOwner(companyId) {
    await connectDB();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Step 1: Find the company to get its photo URL
        const company = await Company.findById(companyId).session(session);

        if (!company) {
            throw new Error("Company not found.");
        }

        const thumbnailUrl = company.thumbnailUrl;

        // Step 2: Delete the photo file from the filesystem
        if (thumbnailUrl) {
            const photoPath = path.join(process.cwd(), "public", thumbnailUrl);
            try {
                await unlink(photoPath);
            } catch (unlinkError) {
                console.warn(
                    `Could not delete file at ${photoPath}. It may not exist.`,
                    unlinkError
                );
            }
        }

        // Step 3: Delete the company document. The pre-hook will handle user deletion.
        const deletedCompany = await company.deleteOne({ session });

        await session.commitTransaction();
        session.endSession();

        return deletedCompany;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error deleting company with photo:", error);
        throw new Error("Failed to delete company with photo.");
    }
}
