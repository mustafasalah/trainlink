import connectDB from "@/app/DBconnection";
import User from "@/app/models/User";
import { getAuthUser } from "@/app/auth";

export async function PATCH(request) {
    const loggedUser = await getAuthUser(true);
    if (!loggedUser) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { email, phoneNumber, skills } = await request.json();

    const cleanEmail = (email || "").toString().trim().toLowerCase();
    const cleanPhone = (phoneNumber || "").toString().trim();
    const cleanSkills = (skills || "").toString().trim();

    const user = await User.findById(loggedUser.id);
    if (!user) {
        return Response.json({ error: "User not found." }, { status: 404 });
    }

    // Update allowed fields
    if (cleanEmail) user.email = cleanEmail;
    user.phoneNumber = cleanPhone;

    if (user.role === "Student") {
        user.academic = user.academic || {};
        user.academic.skills = cleanSkills;
    }

    await user.save();

    return Response.json({ ok: true }, { status: 200 });
}
