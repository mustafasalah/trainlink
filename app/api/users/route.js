import connectDB from "@/app/DBconnection";
import User from "@/app/models/User";

export async function GET(request) {
    // Make a database connection
    await connectDB();

    const users = await User.find();
    return new Response(JSON.stringify(users), {
        status: 200,
        headers: {
            contentType: "application/json",
        },
    });
}
