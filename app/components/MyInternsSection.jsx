"use client";

import React, { useState } from "react";
import JobCard from "./JobCard";
import useLoggedUser from "../hooks/useLoggedUser";

export default function MyInternsSection({
    jobs,
    tabs = ["ongoing", "finished"],
}) {
    const [filter, changeFilter] = useState(null);
    const loggedUser = useLoggedUser();

    return (
        <div className="interns-first-content">
            {loggedUser.role === "Company" ? (
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
                    {loggedUser.role === "Company" ? (
                        <div className="buttons">
                            <button>Add New Intern</button>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            ) : (
                <h3>
                    My Interns<span>({jobs.length})</span>
                </h3>
            )}
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
