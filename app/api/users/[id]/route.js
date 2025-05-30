import connectDB from "@/app/DBconnection";
import User from "@/app/models/Users";
import { revalidatePath } from "next/cache";

export async function GET(request, { params }) {
    // Make a database connection
    await connectDB();

    // Get User Details
    const userId = (await params).id;
    const user = await User.find({ _id: userId });

    if (user) {
        return new Response(JSON.stringify(user[0]), {
            status: 200,
            headers: {
                contentType: "application/json",
            },
        });
    }

    return new Response(`404 - There are no user with this id: ${userId}`, {
        status: 404,
        headers: {
            contentType: "application/json",
        },
    });
}

export async function POST(request, { params }) {
    // Make a database connection
    await connectDB();

    const req = await request.json();

    // Get User Details
    const userId = (await params).id;
    const user = await User.findOne({ _id: userId });

    await User.updateOne(
        { _id: userId },
        {
            email: req.email,
            phoneNumber: req.phoneNumber,
            academic: { ...user.academic._doc, skills: req.skills },
        }
    );

    revalidatePath("/profile", "page");
}
