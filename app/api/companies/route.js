import connectDB from "@/app/DBconnection";
import Company from "@/app/models/Company";

export async function GET(request) {
    // Make a database connection
    await connectDB();

    const companies = await Company.find();
    return new Response(JSON.stringify(companies), {
        status: 200,
        headers: {
            contentType: "application/json",
        },
    });
}
