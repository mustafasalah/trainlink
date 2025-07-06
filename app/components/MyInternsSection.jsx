"use client";
import React, { useState } from "react";
import JobCard from "./JobCard";

export default function MyInternsSection({
    jobs,
    tabs = ["ongoing", "finished"],
}) {
    const [filter, changeFilter] = useState(null);

    return (
        <div className="interns-first-content">
            <div className="head-title">
                <div className="tabs">
                    <button
                        className={filter === null ? "active" : ""}
                        onClick={() => changeFilter(null)}
                    >
                        All
                    </button>
                    {tabs.map((tab) => (
                        <button
                            className={filter === tab ? "active" : ""}
                            onClick={() => changeFilter(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="buttons">
                    <button>Add New Intern</button>
                </div>
            </div>
            <div className="interns-cards">
                {jobs
                    .filter((job) =>
                        filter === null ? true : job.status === filter
                    )
                    .map((job) => (
                        <JobCard key={job._id} intern={job} />
                    ))}
            </div>
        </div>
    );
}
