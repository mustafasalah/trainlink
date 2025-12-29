import { getAuthUser } from "@/app/auth";
import connectDB from "@/app/DBconnection";
import Job from "@/app/models/Job";
import { NextResponse } from "next/server";
import {
    uploadFileToSupabase,
    removeFromSupabase,
} from "@/app/lib/supabaseStorage";

export async function GET(request) {
    const loggedUser = await getAuthUser(true);
    if (!loggedUser) return new Response("[]", { status: 401 });

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get("companyId") ?? loggedUser?.companyId;

    let data = [];
    if (companyId) {
        data = await Job.find({ companyId });
    } else {
        if (loggedUser.role === "Student")
            data = await Job.find({ status: "active" });
        else data = await Job.find();
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { contentType: "application/json" },
    });
}

export async function POST(request) {
    try {
        await connectDB();

        const formData = await request.formData();

        const title = formData.get("title");
        const description = formData.get("description");
        const responsibilities = formData.get("responsibilities");
        const location = formData.get("location");
        const period = formData.get("period");
        const workTime = formData.get("workTime");
        const deadline = formData.get("deadline");
        const companyId = formData.get("companyId");
        const companyName = formData.get("companyName");
        const photo = formData.get("photo");

        if (
            !title ||
            !description ||
            !responsibilities ||
            !location ||
            !period ||
            !workTime ||
            !deadline ||
            !companyId ||
            !companyName
        ) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        if (!(photo instanceof File) || photo.size === 0) {
            return NextResponse.json(
                { error: "Intern photo is required." },
                { status: 400 }
            );
        }

        // Upload to Supabase
        let uploaded = null;
        try {
            uploaded = await uploadFileToSupabase({
                file: photo,
                folder: "jobs",
                fileBaseName: `${companyName}-intern`,
                contentTypeFallback: "image/jpeg",
            });
        } catch (e) {
            console.error("Supabase upload failed:", e);
            return NextResponse.json(
                { error: "Failed to upload photo." },
                { status: 500 }
            );
        }

        try {
            const job = await Job.create({
                title,
                thumbnailUrl: uploaded.publicUrl,
                status: "active",
                companyId,
                companyName,
                location,
                period,
                workTime,
                appliedCounter: 0,
                deadline: new Date(deadline),
                datetime: new Date(),
                description,
                responsibilities,
            });

            return NextResponse.json(
                {
                    ok: true,
                    job: {
                        _id: job._id.toString(),
                        title: job.title,
                        thumbnailUrl: job.thumbnailUrl,
                        status: job.status,
                        companyId: job.companyId,
                        companyName: job.companyName,
                        location: job.location,
                        period: job.period,
                        workTime: job.workTime,
                        deadline: job.deadline,
                        description: job.description,
                        responsibilities: job.responsibilities,
                    },
                },
                { status: 201 }
            );
        } catch (dbErr) {
            // rollback photo if DB fails
            await removeFromSupabase([uploaded?.storagePath]);
            console.error("DB create job failed:", dbErr);

            return NextResponse.json(
                { error: "Failed to create intern job." },
                { status: 500 }
            );
        }
    } catch (err) {
        console.error("Error creating intern job:", err);
        return NextResponse.json(
            { error: "Failed to create intern job." },
            { status: 500 }
        );
    }
}
