"use server";

import mongoose from "mongoose";
import Company from "../models/Company";
import User from "../models/User";
import connectDB from "../DBconnection";
import {
    uploadFileToSupabase,
    removeFromSupabase,
} from "@/app/lib/supabaseStorage";

// Helper: converts any Mongoose Document to plain JSON safe for Server Actions
const toPlain = (doc) => JSON.parse(JSON.stringify(doc));

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

export async function createCompanyAndOwner(companyData, userData, photoFile) {
    await connectDB();
    const session = await mongoose.startSession();
    let uploaded = null;

    try {
        await session.startTransaction();

        if (!(photoFile instanceof File) || photoFile.size === 0) {
            throw new Error("Photo file is missing or invalid.");
        }

        // Pre-check unique fields
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

        // Upload to Supabase (rename to company name)
        uploaded = await uploadFileToSupabase({
            file: photoFile,
            folder: "companies",
            fileBaseName: companyData.name,
            contentTypeFallback: "image/jpeg",
        });

        // Create company
        const companyDocArr = await Company.create(
            [
                {
                    ...companyData,
                    thumbnailUrl: uploaded.publicUrl,
                },
            ],
            { session }
        );
        const companyDoc = companyDocArr[0];

        // Create user linked to company
        const newUserArr = await User.create(
            [
                {
                    ...userData,
                    email: (userData.email || "").toLowerCase(),
                    profileImage: uploaded.publicUrl,
                    role: "Company",
                    companyId: companyDoc._id.toString(),
                    companyName: companyDoc.name,
                },
            ],
            { session }
        );
        const userDoc = newUserArr[0];

        await session.commitTransaction();

        return {
            ok: true,
            company: buildCompanyDTO(toPlain(companyDoc)),
            user: buildUserDTO(toPlain(userDoc)),
        };
    } catch (err) {
        try {
            await session.abortTransaction();
        } catch (_) {}

        // Delete uploaded photo if transaction fails
        if (uploaded?.storagePath) {
            await removeFromSupabase([uploaded.storagePath]);
        }

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

export async function deleteCompanyAndOwner(companyId) {
    await connectDB();
    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        const company = await Company.findById(companyId).session(session);
        if (!company) throw new Error("Company not found.");

        // We only have thumbnailUrl stored, not storagePath
        // So we cannot delete the file precisely from Supabase unless you store thumbnailPath in DB.
        // We'll just delete the company record (owner deleted by pre-hook).
        const result = await company.deleteOne({ session });

        await session.commitTransaction();

        return { ok: true, deletedCount: result?.deletedCount ?? 1 };
    } catch (err) {
        try {
            await session.abortTransaction();
        } catch (_) {}
        console.error("Error deleting company:", err);
        throw new Error(err?.message || "Failed to delete company.");
    } finally {
        session.endSession();
    }
}
