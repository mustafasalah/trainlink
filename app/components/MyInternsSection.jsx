"use client";
import Link from "next/link";
import React, { useState } from "react";
import JobCard from "./JobCard";

export default function MyInternsSection({ jobs }) {
    const [filter, changeFilter] = useState(null);

    return (
        <div className="interns-first-content">
            <div className="tabs">
                <button
                    className={filter === null ? "active" : ""}
                    onClick={() => changeFilter(null)}
                >
                    All
                </button>
                <button
                    className={filter === "ongoing" ? "active" : ""}
                    onClick={() => changeFilter("ongoing")}
                >
                    Ongoing
                </button>
                <button
                    className={filter === "finished" ? "active" : ""}
                    onClick={() => changeFilter("finished")}
                >
                    Finished
                </button>
            </div>
            <div className="interns-cards">
                {jobs
                    .filter((job) =>
                        filter === null ? true : job.status === filter
                    )
                    .map((job) => (
                        <JobCard key={job.id} intern={job} />
                    ))}
            </div>
        </div>
    );
}
