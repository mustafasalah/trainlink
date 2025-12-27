// app/api/internships/[id]/route.js
import path from "path";
import { writeFile, unlink } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/app/DBconnection";
import Job from "@/app/models/Job";
import { getAuthUser } from "@/app/auth";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET(request, { params }) {
    await connectDB();
    const jobId = params.id;
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
        });
    }

    await connectDB();

    const jobId = params.id;
    const job = await Job.findById(jobId);
    if (!job) {
        return new Response(
            JSON.stringify({ error: "Internship not found." }),
            { status: 404 }
        );
    }

    if (
        loggedUser.role !== "Company" ||
        loggedUser.companyId !== job.companyId
    ) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
            status: 403,
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
                {
                    status: 200,
                    headers: { contentType: "application/json" },
                }
            );
        }
        return new Response(JSON.stringify({ error: "Invalid payload." }), {
            status: 400,
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
                { status: 400 }
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
            // delete old file if exists
            if (job.thumbnailUrl) {
                const oldPath = path.join(
                    process.cwd(),
                    "public",
                    job.thumbnailUrl
                );
                try {
                    await unlink(oldPath);
                } catch (_) {}
            }

            const bytes = await photo.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const safeName = photo.name.replace(/\s/g, "_");
            const fileName = `${uuidv4()}-${safeName}`;
            const filePath = path.join(UPLOADS_DIR, fileName);

            await writeFile(filePath, buffer);
            job.thumbnailUrl = `/uploads/${fileName}`;
        }

        await job.save();

        return new Response(JSON.stringify({ ok: true, job }), {
            status: 200,
            headers: { contentType: "application/json" },
        });
    }

    return new Response(
        JSON.stringify({ error: "Unsupported content type." }),
        { status: 415 }
    );
}
