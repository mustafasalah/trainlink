import connectDB from "@/app/DBconnection";
import Job from "@/app/models/Job";

export async function GET(request, { params }) {
    // Make a database connection
    await connectDB();

    // Get Job Details
    const jobId = (await params).id;
    const job = await Job.find({ _id: jobId });

    if (job) {
        return new Response(JSON.stringify(job[0]), {
            status: 200,
            headers: {
                contentType: "application/json",
            },
        });
    }

    return new Response(`404 - There are no job with this id: ${jobId}`, {
        status: 404,
        headers: {
            contentType: "application/json",
        },
    });
}
