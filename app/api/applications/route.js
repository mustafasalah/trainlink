import { NextResponse } from "next/server";
import { getAuthUser } from "@/app/auth";
import connectDB from "@/app/DBconnection";
import Application from "@/app/models/Application";
import Job from "@/app/models/Job";

export async function GET(request) {
    const loggedUser = await getAuthUser(true);
    if (!loggedUser) return new Response("[]", { status: 401 });

    await connectDB();

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    // Base query by role
    let query = {};

    switch (loggedUser.role) {
        case "Student":
            query = { student: loggedUser.id };
            break;

        case "Company": {
            const companyJobs = await Job.find({
                companyId: loggedUser.companyId,
            }).select("_id");

            const jobIds = companyJobs.map((job) => job._id);

            if (jobIds.length === 0) {
                return NextResponse.json([], { status: 200 });
            }

            query = { job: { $in: jobIds } };
            break;
        }

        case "Admin":
            query = {};
            break;

        case "ERO":
            return NextResponse.json(
                { message: "Unauthorized 401." },
                { status: 401 }
            );

        default:
            return NextResponse.json(
                { message: "Unauthorized." },
                { status: 401 }
            );
    }

    // Search filter by job title (populate match)
    const jobMatch = q ? { title: { $regex: q, $options: "i" } } : {};

    let applications = await Application.find(query)
        .populate({
            path: "job",
            model: "Job",
            match: jobMatch,
        })
        .populate({
            path: "student",
            model: "User",
        })
        .lean();

    // If searching by job title, remove non-matching results (job will be null)
    if (q) {
        applications = applications.filter((a) => a.job);
    }

    return NextResponse.json(applications, { status: 200 });
}
