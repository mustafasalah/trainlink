import { NextResponse } from "next/server";
import connectDB from "@/app/DBconnection";
import User from "@/app/models/User";
import { getAuthUser } from "@/app/auth";

export async function GET(request) {
    const loggedUser = await getAuthUser(true);

    if (!loggedUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (loggedUser.role !== "Admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const q = (searchParams.get("q") || "").trim();

    const query = { role: "ERO" };

    if (q) {
        query.$or = [
            { fullName: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { username: { $regex: q, $options: "i" } },
            { phoneNumber: { $regex: q, $options: "i" } },
        ];
    }

    const eros = await User.find(query)
        .select(
            "_id fullName email username phoneNumber role createdAt updatedAt",
        )
        .sort({ createdAt: -1 })
        .lean();

    return NextResponse.json(eros, { status: 200 });
}

export async function POST(request) {
    const loggedUser = await getAuthUser(true);

    if (!loggedUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (loggedUser.role !== "Admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    try {
        const body = await request.json();

        const fullName = (body.fullName || "").toString().trim();
        const email = (body.email || "").toString().trim().toLowerCase();
        const username = (body.username || "").toString().trim();
        const phoneNumber = (body.phoneNumber || "").toString().trim();
        const password = (body.password || "").toString();
        const confirmPassword = (body.confirmPassword || "").toString();

        if (!fullName || !email || !username || !password) {
            return NextResponse.json(
                {
                    error: "Full name, email, username, and password are required.",
                },
                { status: 400 },
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long." },
                { status: 400 },
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: "Password and confirm password do not match." },
                { status: 400 },
            );
        }

        const exists = await User.findOne({
            $or: [{ email }, { username }],
        }).lean();

        if (exists) {
            return NextResponse.json(
                { error: "Email or username is already in use." },
                { status: 400 },
            );
        }

        const ero = await User.create({
            fullName,
            email,
            username,
            phoneNumber,
            password,
            role: "ERO",
            certifications: [],
        });

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
            { status: 201 },
        );
    } catch (err) {
        console.error("Create ERO error:", err);

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
            { error: "Failed to create ERO account." },
            { status: 500 },
        );
    }
}
