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

    const query = {
        role: "Student",
    };

    if (q) {
        query.$or = [
            { fullName: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { studentId: { $regex: q, $options: "i" } },
            { specialization: { $regex: q, $options: "i" } },
            { "academic.department": { $regex: q, $options: "i" } },
            { "academic.college": { $regex: q, $options: "i" } },
        ];
    }

    const students = await User.find(query)
        .select(
            "_id profileImage fullName specialization studentId email phoneNumber academic certifications createdAt",
        )
        .sort({ createdAt: -1 })
        .lean();

    return NextResponse.json(students, { status: 200 });
}
