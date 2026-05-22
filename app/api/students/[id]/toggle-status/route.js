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

    const { id } = params;

    const student = await User.findOne({
        _id: id,
        role: "Student",
    });

    if (!student) {
        return NextResponse.json(
            { error: "Student not found." },
            { status: 404 },
        );
    }

    if (!student.academic) {
        student.academic = {};
    }

    const currentStatus = Boolean(student.academic.registered);

    student.academic.registered = !currentStatus;

    await student.save();

    return NextResponse.json(
        {
            ok: true,
            registered: student.academic.registered,
        },
        { status: 200 },
    );
}
