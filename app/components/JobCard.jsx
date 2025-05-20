import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function JobCard({ intern, hideCompanyName = false }) {
    return (
        <div className="card">
            <div className="card-img">
                <Image
                    src={intern.thumbnailUrl}
                    alt=""
                    width={280}
                    height={120}
                />
                {intern.status ? (
                    <span id={intern.status}>{intern.status}</span>
                ) : (
                    ""
                )}
                <p>{intern.title}</p>
            </div>
            <div className="card-info">
                {hideCompanyName ? "" : <p>{intern.companyName}</p>}
                <span>
                    <i className="icon-map-pin"></i>
                    {intern.location}
                </span>
                <span>
                    <i className="icon-calendar"></i>
                    {intern.period}
                </span>
                <span>
                    <i className="icon-clock"></i>
                    {intern.workTime}
                </span>
                <span>
                    <i className="icon-users"></i>
                    {intern.appliedCounter} student applied
                </span>
            </div>
            <div className="footer-card">
                <span>
                    <i className="icon-history"></i>
                    {intern.datetime}
                </span>
                <Link href={`/interns/${intern.id}`}>
                    View details <i className="icon-chevron-right"></i>
                </Link>
            </div>
        </div>
    );
}
