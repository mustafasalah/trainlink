import { NextResponse } from "next/server";
import connectDB from "@/app/DBconnection";
import Job from "@/app/models/Job";
import path from "path";
import { unlink } from "fs/promises";

// PATCH /api/interns/:id  → update status (active/inactive)
export async function PATCH(request, { params }) {
    try {
        await connectDB();

        const body = await request.json();
        const { status } = body || {};

        if (!status || !["active", "inactive"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status value." },
                { status: 400 }
            );
        }

        const job = await Job.findById(params.id);
        if (!job) {
            return NextResponse.json(
                { error: "Internship not found." },
                { status: 404 }
            );
        }

        job.status = status;
        await job.save();

        return NextResponse.json(
            {
                ok: true,
                job: {
                    _id: job._id.toString(),
                    status: job.status,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Update internship status error:", err);
        return NextResponse.json(
            { error: "Failed to update internship status." },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();

        const job = await Job.findById(params.id);
        if (!job) {
            return NextResponse.json(
                { error: "Internship not found." },
                { status: 404 }
            );
        }

        // DELETE IMAGE
        if (job.thumbnailUrl) {
            const filepath = path.join(
                process.cwd(),
                "public",
                job.thumbnailUrl.replace(/^\//, "")
            );
            try {
                await unlink(filepath);
            } catch (e) {
                console.warn("Could not delete file:", filepath, e);
            }
        }

        await Job.deleteOne({ _id: params.id });

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err) {
        console.error("Delete internship error:", err);
        return NextResponse.json(
            { error: "Failed to delete internship." },
            { status: 500 }
        );
    }
}
