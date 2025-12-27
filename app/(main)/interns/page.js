import React from "react";
import JobCard from "../../components/JobCard";
import MyInternsSection from "../../components/MyInternsSection";
import { getAuthToken } from "@/app/auth";

export const dynamic = "force-dynamic";

export default async function page() {
    const internshipsData = await fetch(
        "http://localhost:3000/api/internships",
        {
            headers: {
                "auth-token": await getAuthToken(),
            },
            next: { tags: ["internships"] },
        }
    );
    const jobsData = await fetch("http://localhost:3000/api/jobs", {
        headers: { "auth-token": await getAuthToken() },
        next: { tags: ["jobs"] },
    });
    const internships = await internshipsData.json();
    const jobs = await jobsData.json();
    const availableJobs = jobs.filter(
        (job) =>
            !internships.some(
                ({ application }) => application.job._id === job._id
            )
    );

    return (
        <div className="content">
            <div className="interns">
                <MyInternsSection internships={internships} />

                <div className="available-interns">
                    <h3>
                        Available Interns<span>({availableJobs.length})</span>
                    </h3>
                    <div className="cards">
                        {availableJobs.map((job) => (
                            <JobCard key={job._id} job={job} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
