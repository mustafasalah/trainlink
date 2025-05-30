import connectDB from "@/app/DBconnection";
import Job from "@/app/models/Job";

export async function GET(request) {
    // Make a database connection
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get("companyId");

    let data = [];
    if (companyId) {
        data = await Job.find({ companyId: companyId });
    } else {
        data = await Job.find();
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            contentType: "application/json",
        },
    });
}
