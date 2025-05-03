import compaines from "@/app/DB/jobs";

export async function GET(request, { params }) {
    // Get Compaine Details
    const jobId = await params.id;
    const job = compaines.find(({ id }) => id == jobId);

    if (job) {
        return new Response(JSON.stringify(job), {
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
