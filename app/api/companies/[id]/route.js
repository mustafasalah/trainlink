import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/app/DBconnection";
import Company from "@/app/models/Company";
import User from "@/app/models/User";
import { getAuthUser } from "@/app/auth";

export async function GET(request, { params }) {
    await connectDB();

    const { id } = await params;

    const company = await Company.findById(id).lean();

    if (!company) {
        return NextResponse.json(
            { error: "Company not found." },
            { status: 404 },
        );
    }

    return NextResponse.json(company, { status: 200 });
}

export async function PATCH(request, { params }) {
    const loggedUser = await getAuthUser(true);

    if (!loggedUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (loggedUser.role !== "ERO") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const name = (body.name || "").toString().trim();
    const email = (body.email || "").toString().trim().toLowerCase();
    const phoneNumber = (body.phoneNumber || "").toString().trim();
    const website = (body.website || "").toString().trim();
    const industry = (body.industry || "").toString().trim();
    const about = (body.about || "").toString().trim();

    const agreement = body.agreement || {};

    if (!name) {
        return NextResponse.json(
            { error: "Company name is required." },
            { status: 400 },
        );
    }

    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        const company = await Company.findById(id).session(session);

        if (!company) {
            throw new Error("Company not found.");
        }

        // Check duplicate company name
        const duplicateName = await Company.findOne({
            _id: { $ne: id },
            name,
        }).session(session);

        if (duplicateName) {
            throw new Error("A company with this name already exists.");
        }

        // Check duplicate company email if provided
        if (email) {
            const duplicateCompanyEmail = await Company.findOne({
                _id: { $ne: id },
                email,
            }).session(session);

            if (duplicateCompanyEmail) {
                throw new Error("Company email is already in use.");
            }

            const duplicateUserEmail = await User.findOne({
                companyId: { $ne: id },
                email,
            }).session(session);

            if (duplicateUserEmail) {
                throw new Error("Email is already used by another user.");
            }
        }

        // Update company
        company.name = name;
        company.email = email || undefined;
        company.phoneNumber = phoneNumber;
        company.website = website;
        company.industry = industry;
        company.about = about;

        company.agreement = {
            date: agreement.date
                ? new Date(agreement.date)
                : company.agreement?.date,
            period: agreement.period || "",
            renewal_type: agreement.renewal_type || "",
            nature: agreement.nature || "",
        };

        await company.save({ session });

        // Update linked company user
        await User.updateOne(
            {
                role: "Company",
                companyId: company._id.toString(),
            },
            {
                $set: {
                    companyName: company.name,
                    email: email || company.email,
                    phoneNumber,
                },
            },
            { session },
        );

        await session.commitTransaction();

        return NextResponse.json(
            {
                ok: true,
                company: {
                    _id: company._id.toString(),
                    name: company.name,
                    email: company.email,
                    phoneNumber: company.phoneNumber,
                    website: company.website,
                    industry: company.industry,
                    about: company.about,
                    agreement: company.agreement,
                },
            },
            { status: 200 },
        );
    } catch (err) {
        try {
            await session.abortTransaction();
        } catch (_) {}

        console.error("Update company error:", err);

        if (err?.code === 11000) {
            const fields = Object.keys(err.keyPattern || {});
            return NextResponse.json(
                {
                    error: `Duplicate value for: ${fields.join(", ")}`,
                },
                { status: 400 },
            );
        }

        return NextResponse.json(
            {
                error: err.message || "Failed to update company.",
            },
            { status: 400 },
        );
    } finally {
        session.endSession();
    }
}
