import { getAuthUser } from "@/app/auth";
import connectDB from "@/app/DBconnection";
import Application from "@/app/models/Application";
import Job from "@/app/models/Job";
import User from "@/app/models/User";
import { revalidateTag } from "next/cache";

export async function GET(request) {
    let loggedUser = await getAuthUser(true);

    if (!loggedUser) return new Response("[]", { status: 401 });

    // Make a database connection
    await connectDB();

    if (!loggedUser)
        return new Response("Not Authorized.", {
            status: 401,
            headers: {
                contentType: "application/json",
            },
        });

    let query = {}; // Initialize an empty query object

    switch (loggedUser.role) {
        case "Student":
            query = { student: loggedUser.id };
            break;

        case "Company":
            // 1. Find all Job IDs that belong to this company
            let companyJobs = [];
            try {
                companyJobs = await Job.find({
                    companyId: loggedUser.companyId,
                }).select("_id");
            } catch (jobError) {
                console.error("Error fetching jobs for company:", jobError);
                return NextResponse.json(
                    { message: "Error retrieving company jobs." },
                    { status: 500 }
                );
            }

            // Extract just the ObjectIds into an array
            const jobIds = companyJobs.map((job) => job._id);

            if (jobIds.length === 0) {
                // If the company has no jobs, then there are no applications for them
                return NextResponse.json(
                    {
                        message:
                            "No applications found for this company (no jobs posted).",
                    },
                    { status: 200 }
                );
            }

            // 2. Find applications where the 'job' field is one of the jobIds found
            query = { job: { $in: jobIds } };
            break;

        case "Admin":
            // For Admin or ERO, return all applications (or implement specific filters)
            query = {};
            break;

        case "ERO":
            return NextResponse.json(
                {
                    message: "Unauthorized 401.",
                },
                { status: 401 }
            );
    }

    const applications = await Application.find(query)
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
