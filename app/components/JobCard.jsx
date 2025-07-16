"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { format } from "timeago.js";
import useLoggedUser from "../hooks/useLoggedUser";

export default function JobCard({
    job,
    InternStatus = null,
    hideCompanyName = false,
}) {
    const loggedUser = useLoggedUser();

    return (
        <div className="card">
            <div className="card-img">
                <Image src={job.thumbnailUrl} alt="" width={280} height={120} />
                {InternStatus ? (
                    <span className={InternStatus.toLowerCase()}>
                        {InternStatus}
                    </span>
                ) : loggedUser.role !== "Student" ? (
                    <span className={job.status.toLowerCase()}>
                        {job.status}
                    </span>
                ) : (
                    ""
                )}
                <p>{job.title}</p>
            </div>
            <div className="card-info">
                {hideCompanyName ? "" : <p>{job.companyName}</p>}
                <span>
                    <i className="icon-map-pin"></i>
                    {job.location}
                </span>
                <span>
                    <i className="icon-calendar"></i>
                    {job.period}
                </span>
                <span>
                    <i className="icon-clock"></i>
                    {job.workTime}
                </span>
                <span>
                    <i className="icon-users"></i>
                    {job.appliedCounter} student applied
                </span>
            </div>
            <div className="footer-card">
                <span>
                    <i className="icon-history"></i>
                    {format(job.datetime)}
                </span>
                <Link href={`/interns/${job._id}`}>
                    View details <i className="icon-chevron-right"></i>
                </Link>
            </div>
        </div>
    );
}
