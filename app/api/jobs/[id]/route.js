import connectDB from "@/app/DBconnection";
import Job from "@/app/models/Job";
import { getAuthUser } from "@/app/auth";
import {
    uploadFileToSupabase,
    removeFromSupabase,
} from "@/app/lib/supabaseStorage";

export async function GET(request, { params }) {
    await connectDB();

    const jobId = (await params).id;
    const job = await Job.findById(jobId).lean();

    if (job) {
        return new Response(JSON.stringify(job), {
            status: 200,
            headers: { contentType: "application/json" },
        });
    }

    return new Response(`404 - There are no job with this id: ${jobId}`, {
        status: 404,
        headers: { contentType: "application/json" },
    });
}

export async function PATCH(request, { params }) {
    const loggedUser = await getAuthUser(true);
    if (!loggedUser) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { contentType: "application/json" },
        });
    }

    await connectDB();

    const jobId = params.id;
    const job = await Job.findById(jobId);
    if (!job) {
        return new Response(
            JSON.stringify({ error: "Internship not found." }),
            { status: 404, headers: { contentType: "application/json" } },
        );
    }

    if (
        loggedUser.role !== "Company" ||
        loggedUser.companyId !== job.companyId
    ) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
            status: 403,
            headers: { contentType: "application/json" },
        });
    }

    const contentType = request.headers.get("content-type") || "";

    // 1) JSON PATCH (for status toggle)
    if (contentType.includes("application/json")) {
        const body = await request.json();

        if (body.status && ["active", "inactive"].includes(body.status)) {
            job.status = body.status;
            await job.save();

            return new Response(
                JSON.stringify({ ok: true, status: job.status }),
                { status: 200, headers: { contentType: "application/json" } },
            );
        }

        return new Response(JSON.stringify({ error: "Invalid payload." }), {
            status: 400,
            headers: { contentType: "application/json" },
        });
    }

    // 2) FormData PATCH (edit details + optional photo)
    if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData();

        const title = (formData.get("title") || "").toString().trim();
        const description = (formData.get("description") || "")
            .toString()
            .trim();
        const responsibilities = (formData.get("responsibilities") || "")
            .toString()
            .trim();
        const location = (formData.get("location") || "").toString().trim();
        const period = (formData.get("period") || "").toString().trim();
        const workTime = (formData.get("workTime") || "").toString().trim();
        const deadline = (formData.get("deadline") || "").toString().trim();

        if (
            !title ||
            !description ||
            !responsibilities ||
            !location ||
            !period ||
            !workTime ||
            !deadline
        ) {
            return new Response(
                JSON.stringify({ error: "Missing required fields." }),
                { status: 400, headers: { contentType: "application/json" } },
            );
        }

        job.title = title;
        job.description = description;
        job.responsibilities = responsibilities;
        job.location = location;
        job.period = period;
        job.workTime = workTime;
        job.deadline = new Date(deadline);

        // optional photo
        const photo = formData.get("photo");
        if (photo instanceof File && photo.size > 0) {
            // upload new photo
            const uploaded = await uploadFileToSupabase({
                file: photo,
                folder: "jobs",
                fileBaseName: `${job.companyName}-intern`,
                contentTypeFallback: "image/jpeg",
            });

            job.thumbnailUrl = uploaded.publicUrl;
        }

        await job.save();

        return new Response(JSON.stringify({ ok: true, job }), {
            status: 200,
            headers: { contentType: "application/json" },
        });
    }

    return new Response(
        JSON.stringify({ error: "Unsupported content type." }),
        { status: 415, headers: { contentType: "application/json" } },
    );
}
