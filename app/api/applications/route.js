import applications from "@/app/DB/applications";
import jobs from "@/app/DB/jobs";
import { revalidateTag } from "next/cache";

export async function GET(request) {
    return new Response(JSON.stringify(applications), {
        status: 200,
        headers: {
            contentType: "application/json",
        },
    });
}

export async function POST(request) {
    const req = await request.json();

    const job = jobs.find((job) => job.id === req.jobId);
    job.status = "ongoing";
    revalidateTag("jobs");

    applications.push({
        id: applications.length,
        internId: req.jobId,
        title: req.title,
        status: "pending",
        datetime: new Date().toISOString().replace("T", " ").slice(0, -5),
    });

    return new Response("Done", {
        status: 200,
        headers: {
            contentType: "application/json",
        },
    });
}
