"use client";

import React, { useState } from "react";
import JobCard from "./JobCard";
import useLoggedUser from "../hooks/useLoggedUser";

export default function MyInternsSection({
    internships,
    tabs = ["Ongoing", "Finished"],
}) {
    const [filter, changeFilter] = useState(null);
    const loggedUser = useLoggedUser();

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
                            key={tab}
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
            <div className="interns-cards">
                {loggedUser.role === "Student"
                    ? internships
                          .filter(({ status }) =>
                              filter === null ? true : status === filter
                          )
                          .map(({ application: { job }, status }) => (
                              <JobCard
                                  key={job._id}
                                  job={job}
                                  InternStatus={status}
                              />
                          ))
                    : internships
                          .filter(({ status }) =>
                              filter === null ? true : status === filter
                          )
                          .map((intern) => (
                              <JobCard key={intern._id} job={intern} />
                          ))}
            </div>
        </div>
    );
}
