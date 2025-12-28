import { NextResponse } from "next/server";
import connectDB from "@/app/DBconnection";
import { getAuthUser } from "@/app/auth";
import Application from "@/app/models/Application";
import Internship from "@/app/models/Internship";
import Job from "@/app/models/Job";

export async function PATCH(request) {
    const loggedUser = await getAuthUser(true);
    if (!loggedUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (loggedUser.role !== "Company") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const { applicationId } = await request.json();
    if (!applicationId) {
        return NextResponse.json(
            { error: "applicationId is required" },
            { status: 400 }
        );
    }

    // 1) Get application and validate accepted
    const application = await Application.findById(applicationId).lean();
    if (!application) {
        return NextResponse.json(
            { error: "Application not found" },
            { status: 404 }
        );
    }

    if (!application.acceptedByAdmin || application.status !== "Accepted") {
        return NextResponse.json(
            { error: "This application is not an accepted internship." },
            { status: 400 }
        );
    }

    // 2) Load job to verify company ownership
    const job = await Job.findById(application.job).lean();
    if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.companyId !== loggedUser.companyId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3) Find internship by applicationId
    const internship = await Internship.findOne({ application: applicationId });
    if (!internship) {
        return NextResponse.json(
            { error: "Internship record not found for this application." },
            { status: 404 }
        );
    }

    if (internship.status !== "Ongoing") {
        return NextResponse.json(
            {
                error: `Cannot finish internship because it is "${internship.status}".`,
            },
            { status: 400 }
        );
    }

    internship.status = "Finished";
    await internship.save();

    return NextResponse.json(
        { ok: true, internshipStatus: internship.status },
        { status: 200 }
    );
}
