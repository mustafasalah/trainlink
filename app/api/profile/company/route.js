import mongoose from "mongoose";
import connectDB from "@/app/DBconnection";
import Company from "@/app/models/Company";
import User from "@/app/models/User";
import { getAuthUser } from "@/app/auth";

export async function PATCH(request) {
    const loggedUser = await getAuthUser(true);
    if (!loggedUser) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (loggedUser.role !== "Company") {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const { email, phoneNumber, website } = await request.json();

    // basic validation
    const cleanEmail = (email || "").toString().trim().toLowerCase();
    const cleanPhone = (phoneNumber || "").toString().trim();
    const cleanWebsite = (website || "").toString().trim();

    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        // 1) Update User
        const user = await User.findById(loggedUser.id).session(session);
        if (!user) {
            throw new Error("User not found.");
        }

        user.email = cleanEmail || user.email;
        user.phoneNumber = cleanPhone;
        await user.save({ session });

        // 2) Update Company (by companyId from user)
        const companyId = user.companyId || loggedUser.companyId;
        if (!companyId) {
            throw new Error("CompanyId not found for this user.");
        }

        const company = await Company.findById(companyId).session(session);
        if (!company) {
            throw new Error("Company not found.");
        }

        // keep email/phone in sync
        company.email = cleanEmail || company.email;
        company.phoneNumber = cleanPhone;
        company.website = cleanWebsite;

        await company.save({ session });

        await session.commitTransaction();

        return Response.json(
            {
                ok: true,
                user: {
                    _id: user._id.toString(),
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                },
                company: {
                    _id: company._id.toString(),
                    email: company.email,
                    phoneNumber: company.phoneNumber,
                    website: company.website,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        try {
            await session.abortTransaction();
        } catch (_) {}
        return Response.json(
            { error: err.message || "Failed to update company profile." },
            { status: 400 }
        );
    } finally {
        session.endSession();
    }
}
