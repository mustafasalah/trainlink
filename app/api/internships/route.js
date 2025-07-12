import { getAuthUser } from "@/app/auth";
import connectDB from "@/app/DBconnection";
import Internship from "@/app/models/Internship";
import Application from "@/app/models/Application";
import User from "@/app/models/User";
import Job from "@/app/models/Job";
import Company from "@/app/models/Company";

export async function GET(request) {
    const loggedUser = await getAuthUser();

    if (!loggedUser) return new Response("Not Authorized.", { status: 401 });

    // Make a database connection
    await connectDB();

    const internships = await Internship.find(
        loggedUser.role === "Student"
            ? { student: loggedUser.id }
            : { company: loggedUser.companyId }
    )
        .populate({
            path: "application", // Populate the 'application' field
            model: "Application",
            populate: {
                path: "job",
                model: "Job",
                populate: {
                    path: "company",
                    model: "Company",
                },
            },
        })
        .populate({
            path: "student", // Populate the 'student' field directly on Internship
            model: "User", // Explicitly specify User model for the student
        })
        .populate({
            path: "company", // Populate the 'company' field directly on Internship
            model: "Company", // Explicitly specify your Company model
        })
        .lean();

    return new Response(JSON.stringify(internships), {
        status: 200,
        headers: {
            contentType: "application/json",
        },
    });
}
