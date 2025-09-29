"use server";

import path from "path";
import { unlink, writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import Company from "../models/Company";
import User from "../models/User";
import connectDB from "../DBconnection";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Helper: converts any Mongoose Document to plain JSON safe for Server Actions
const toPlain = (doc) => JSON.parse(JSON.stringify(doc));

// Helper: builds flat, safe Company DTO
const buildCompanyDTO = (c) => ({
    _id: c._id?.toString?.() ?? c._id,
    thumbnailUrl: c.thumbnailUrl ?? null,
    name: c.name,
    email: c.email ?? null,
    phoneNumber: c.phoneNumber ?? null,
    website: c.website ?? null,
    industry: c.industry ?? null,
    agreement: c.agreement
        ? {
              date: c.agreement.date,
              period: c.agreement.period,
              renewal_type: c.agreement.renewal_type,
              nature: c.agreement.nature,
          }
        : null,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
});

// Helper: builds flat, safe User DTO
const buildUserDTO = (u) => ({
    _id: u._id?.toString?.() ?? u._id,
    profileImage: u.profileImage ?? null,
    fullName: u.fullName,
    email: u.email,
    username: u.username ?? null,
    role: u.role,
    phoneNumber: u.phoneNumber ?? null,
    companyId: u.companyId ?? null,
    companyName: u.companyName ?? null,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
});

// Since thumbnailUrl starts with "/uploads/..."
// turn it into an absolute path under /public
const publicPathFromThumb = (thumb) => {
    // strip leading "/" if present
    const relative = thumb?.startsWith("/") ? thumb.slice(1) : thumb || "";
    return path.join(process.cwd(), "public", relative); // public/uploads/...
};

/**
 * Creates a new company and its owner user atomically.
 * Returns plain DTOs (no Mongoose Documents) to avoid serialization/circular issues.
 */
export async function createCompanyAndOwner(companyData, userData, photoFile) {
    await connectDB();
    const session = await mongoose.startSession();
    let thumbnailUrl = ""; // keep it to delete the file in case of failure

    try {
        await session.startTransaction();

        // 0) Validate photo file
        if (!(photoFile instanceof File)) {
            throw new Error("Photo file is missing or invalid.");
        }

        // 1) Pre-check unique fields to provide clearer error messages
        //    - Company: name (unique), email (unique but optional)
        //    - User: email (required, unique), username (unique, sparse)
        const checks = await Promise.all([
            Company.exists({ name: companyData?.name }),
            companyData?.email
                ? Company.exists({ email: companyData.email })
                : null,
            User.exists({ email: (userData?.email || "").toLowerCase() }),
            userData?.username
                ? User.exists({ username: userData.username })
                : null,
        ]);
        if (checks[0])
            throw new Error("A company with this name already exists.");
        if (checks[1]) throw new Error("Company email is already in use.");
        if (checks[2]) throw new Error("Owner email is already in use.");
        if (checks[3]) throw new Error("Username is already taken.");

        // 2) Upload the photo
        const photoBytes = await photoFile.arrayBuffer();
        const photoBuffer = Buffer.from(photoBytes);
        const fileName = `${uuidv4()}-${photoFile.name.replace(/\s/g, "_")}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        await writeFile(filePath, photoBuffer);
        thumbnailUrl = `/uploads/${fileName}`;

        // 3) Create company
        const companyDocArr = await Company.create(
            [
                {
                    ...companyData,
                    thumbnailUrl,
                },
            ],
            { session }
        );
        const companyDoc = companyDocArr[0];

        // 4) Create user and link it to the company
        const newUserArr = await User.create(
            [
                {
                    ...userData,
                    email: (userData.email || "").toLowerCase(),
                    profileImage: thumbnailUrl,
                    role: "Company",
                    companyId: companyDoc._id.toString(),
                    companyName: companyDoc.name,
                },
            ],
            { session }
        );
        const userDoc = newUserArr[0];

        // 5) Commit transaction
        await session.commitTransaction();

        // 6) Return flat DTOs (no Mongoose Documents)
        const companyDTO = buildCompanyDTO(toPlain(companyDoc));
        const userDTO = buildUserDTO(toPlain(userDoc));
        return { ok: true, company: companyDTO, user: userDTO };
    } catch (err) {
        // Rollback the transaction
        try {
            await session.abortTransaction();
        } catch (_) {}

        // Delete the uploaded photo if it was saved
        if (thumbnailUrl) {
            try {
                await unlink(publicPathFromThumb(thumbnailUrl));
            } catch (unlinkError) {
                console.warn(
                    "Failed to delete uploaded file on error:",
                    unlinkError
                );
            }
        }

        // Provide clearer messages for duplicate key errors (code 11000)
        if (err?.code === 11000) {
            const fields = Object.keys(err.keyPattern || {});
            throw new Error(
                `Duplicate value for unique field(s): ${fields.join(", ")}.`
            );
        }

        console.error("Error creating company with photo:", err);
        throw new Error(err?.message || "Failed to create company with photo.");
    } finally {
        session.endSession();
    }
}

/**
 * Deletes a company and its owner (owner deleted by Company pre hook).
 * Returns a plain JSON result (not a Mongoose Document).
 */
export async function deleteCompanyAndOwner(companyId) {
    await connectDB();
    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        const company = await Company.findById(companyId).session(session);
        if (!company) {
            throw new Error("Company not found.");
        }

        const thumbnailUrl = company.thumbnailUrl;

        // Remove the photo from the filesystem
        if (thumbnailUrl) {
            try {
                await unlink(publicPathFromThumb(thumbnailUrl));
            } catch (unlinkError) {
                console.warn(
                    `Could not delete file for ${thumbnailUrl}. It may not exist.`,
                    unlinkError
                );
            }
        }

        // Delete the company (pre hook will delete the owner)
        const result = await company.deleteOne({ session });

        await session.commitTransaction();

        // Return a simple result (no documents)
        return { ok: true, deletedCount: result?.deletedCount ?? 1 };
    } catch (err) {
        try {
            await session.abortTransaction();
        } catch (_) {}
        console.error("Error deleting company with photo:", err);
        throw new Error(err?.message || "Failed to delete company with photo.");
    } finally {
        session.endSession();
    }
}
