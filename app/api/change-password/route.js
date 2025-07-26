import { getAuthUser } from "@/app/auth";
import connectDB from "@/app/DBconnection";
import User from "@/app/models/User";

export async function POST(request) {
    const loggedUser = await getAuthUser();

    if (!loggedUser)
        return new Response("Unauthorized.", {
            status: 401,
        });

    const data = await request.json();
    const oldPassword = data.oldPass;
    const newPassword = data.newPass;
    const confirmPassword = data.confirmPass;

    if (!oldPassword || !newPassword || !confirmPassword) {
        return new Response("Some fields are missed.", {
            status: 400,
        });
    }

    if (newPassword !== confirmPassword) {
        return new Response("Confirm passowrd doesn't match the new password", {
            status: 400,
        });
    }

    // Make a database connection
    await connectDB();

    const user = await User.findById(loggedUser.id).select("+password");

    // Compare passwords
    const isMatch = await user.matchPassword(oldPassword);

    if (!isMatch) {
        return new Response("Invalid credentials.", {
            status: 400,
        });
    }

    user.password = newPassword;
    user.save();

    return new Response("The password has been changed successfully!", {
        status: 200,
    });
}
