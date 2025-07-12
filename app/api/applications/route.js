import connectDB from "@/app/DBconnection";
import Application from "@/app/models/Application";
import Job from "@/app/models/Job";
import User from "@/app/models/User";
import { revalidateTag } from "next/cache";

export async function GET(request) {
    // Make a database connection
    await connectDB();

    const applications = await Application.find()
        .populate({
            path: "job",
            model: "Job",
        })
        .populate({ path: "student", model: "User" });

    return new Response(JSON.stringify(applications), {
        status: 200,
        headers: {
            contentType: "application/json",
        },
    });
}

export async function POST(request) {
    const req = await request.json();

    await Job.updateOne({ _id: req.jobId }, { status: "ongoing" });
    revalidateTag("jobs");

    new Application({
        internId: req.jobId,
        title: req.title,
        status: "pending",
        datetime: new Date().toISOString(),
    }).save();

    // applications.push({
    //     id: applications.length,

    //     datetime: new Date().toISOString().replace("T", " ").slice(0, -5),
    // });

    return new Response("Done", {
        status: 200,
        headers: {
            contentType: "application/json",
        },
    });
}
