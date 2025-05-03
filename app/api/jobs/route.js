import jobs from "@/app/DB/jobs";

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get("companyId");

    const data = companyId
        ? jobs.filter((job) => job.companyId == companyId)
        : jobs;

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            contentType: "application/json",
        },
    });
}
