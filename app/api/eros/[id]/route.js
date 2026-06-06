import { NextResponse } from "next/server";
import connectDB from "@/app/DBconnection";
import User from "@/app/models/User";
import { getAuthUser } from "@/app/auth";

export async function PATCH(request, { params }) {
    const loggedUser = await getAuthUser(true);

    if (!loggedUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (loggedUser.role !== "Admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    try {
        const { id } = await params;
        const body = await request.json();

        const ero = await User.findOne({ _id: id, role: "ERO" }).select(
            "+password"
        );

        if (!ero) {
            return NextResponse.json(
                { error: "ERO account not found." },
                { status: 404 }
            );
        }

        const fullName = (body.fullName || "").toString().trim();
        const email = (body.email || "").toString().trim().toLowerCase();
        const username = (body.username || "").toString().trim();
        const phoneNumber = (body.phoneNumber || "").toString().trim();
        const password = (body.password || "").toString();

        if (!fullName || !email || !username) {
            return NextResponse.json(
                { error: "Full name, email, and username are required." },
                { status: 400 }
            );
        }

        const duplicate = await User.findOne({
            _id: { $ne: id },
            $or: [{ email }, { username }],
        }).lean();

        if (duplicate) {
            return NextResponse.json(
                { error: "Email or username is already used by another user." },
                { status: 400 }
            );
        }

        ero.fullName = fullName;
        ero.email = email;
        ero.username = username;
        ero.phoneNumber = phoneNumber;

        if (password) {
            if (password.length < 6) {
                return NextResponse.json(
                    { error: "Password must be at least 6 characters long." },
                    { status: 400 }
                );
            }

            ero.password = password;
        }

        await ero.save();

        return NextResponse.json(
            {
                ok: true,
                ero: {
                    _id: ero._id.toString(),
                    fullName: ero.fullName,
                    email: ero.email,
                    username: ero.username,
                    phoneNumber: ero.phoneNumber,
                    role: ero.role,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Update ERO error:", err);

        if (err?.code === 11000) {
            const fields = Object.keys(err.keyPattern || {});
            return NextResponse.json(
                {
                    error: `Duplicate value for: ${fields.join(", ")}`,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to update ERO account." },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    const loggedUser = await getAuthUser(true);

    if (!loggedUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (loggedUser.role !== "Admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    try {
        const { id } = await params;

        const result = await User.deleteOne({
            _id: id,
            role: "ERO",
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "ERO account not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { ok: true, deletedCount: result.deletedCount },
            { status: 200 }
        );
    } catch (err) {
        console.error("Delete ERO error:", err);

        return NextResponse.json(
            { error: "Failed to delete ERO account." },
            { status: 500 }
        );
    }
}