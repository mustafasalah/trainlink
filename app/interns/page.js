import Image from "next/image";
import Link from "next/link";
import React from "react";
import JobCard from "../components/JobCard";
import MyInternsSection from "../components/MyInternsSection";

export default async function page() {
    const data = await fetch("http://localhost:3000/api/jobs");
    const jobs = await data.json();
    const availableJobs = jobs.filter((job) => job.status === null);
    const takedJobs = jobs.filter((job) => job.status != null);

    return (
        <div className="content">
            <div className="interns">
                <MyInternsSection jobs={takedJobs} />
                <div className="available-interns">
                    <h3>
                        Available Interns<span>({availableJobs.length})</span>
                    </h3>
                    <div className="cards">
                        {availableJobs.map((job) => (
                            <JobCard key={job.id} intern={job} />
                        ))}
                    </div>
                    {/* <div className="view-more">
                        <button>View More</button>
                        <p>(3 of 12 Training Opportunities)</p>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
