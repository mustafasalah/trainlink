import { getAuthUser } from "@/app/auth";
import connectDB from "@/app/DBconnection";
import Job from "@/app/models/Job";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function GET(request) {
    let loggedUser = await getAuthUser(true);

    if (!loggedUser) return new Response("[]", { status: 401 });

    // Make a database connection
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    let companyId = searchParams.get("companyId") ?? loggedUser?.companyId;

    let data = [];
    if (companyId) {
        data = await Job.find({ companyId: companyId });
    } else {
        if (loggedUser.role === "Student")
            data = await Job.find({ status: "active" });
        else {
            data = await Job.find();
        }
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            contentType: "application/json",
        },
    });
}

const UPLOADS_DIR = path.join(process.cwd(), "public", "img");

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

        // extract extension
        const originalName = photo.name || "image";
        const ext = originalName.includes(".")
            ? originalName.substring(originalName.lastIndexOf("."))
            : ".jpg";

        // sanitize company name for safe filename
        let safeCompanyName = companyName
            .toLowerCase()
            .replace(/[^a-z0-9\-]/gi, "-") // replace invalid chars with "-"
            .replace(/-+/g, "-") // collapse repeated hyphens
            .replace(/^-|-$/g, ""); // trim leading/trailing "-"

        // final file name: companyname-intern-<timestamp>.jpg
        const fileName = `${safeCompanyName}-intern-${Date.now()}${ext}`;

        const uploadPath = path.join(UPLOADS_DIR, fileName);
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);

        await writeFile(uploadPath, buffer);
        const thumbnailUrl = `/img/${fileName}`;

        const job = await Job.create({
            title,
            thumbnailUrl,
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
    } catch (err) {
        console.error("Error creating intern job:", err);
        return NextResponse.json(
            { error: "Failed to create intern job." },
            { status: 500 }
        );
    }
}
