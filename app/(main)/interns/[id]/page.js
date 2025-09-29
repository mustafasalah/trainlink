import Image from "next/image";
import React from "react";
import ApplySection from "@/app/components/ApplySection";
import { getAuthToken, getAuthUser } from "@/app/auth";

export const dynamic = "force-dynamic";

export default async function InternDetails({ params }) {
    const jobId = (await params).id;
    const jobData = await fetch(`http://localhost:3000/api/jobs/${jobId}`, {
        next: { tags: ["jobs"] },
    });
    const job = await jobData.json();

    const companyData = await fetch(
        `http://localhost:3000/api/companies/${job.companyId}`
    );
    const company = await companyData.json();
    const loggedUser = await getAuthUser();

    return (
        <div className="content">
            <div className="intern-details">
                <div className="intern-details-card">
                    <div className="intern-details-img">
                        <Image
                            src={job.thumbnailUrl}
                            alt=""
                            width="1035"
                            height="250"
                        />
                        <p>{job.title}</p>
                    </div>
                    <div className="intern-details-info">
                        <h3 className="provided-by">
                            Provided By{" "}
                            <a href={`/companies/${job.companyId}`}>
                                {company.name}
                            </a>
                        </h3>
                        <div className="intern-description">
                            <h3>Description</h3>
                            <p>{job.description}</p>
                        </div>
                        <div className="intern-key-information">
                            <h3>Key Information</h3>
                            <ul>
                                <li>Application Deadline: {job.deadline}</li>
                                <li>Intern Period: {job.period}</li>
                                <li>Work Time: {job.workTime}</li>
                                <li>location: {job.location}</li>
                            </ul>
                        </div>
                        <div className="intern-responsibilities">
                            <h3>Responsibilities</h3>
                            <p style={{ whiteSpace: "pre-line" }}>
                                {job.responsibilities}
                            </p>
                        </div>
                        <div className="intern-contact-information">
                            <h3>Contact Information</h3>
                            <ul>
                                {company.phoneNumber && (
                                    <li>
                                        <i className="icon-phone"></i>Phone
                                        number: {company.phoneNumber}
                                    </li>
                                )}
                                {company.email && (
                                    <li>
                                        <i className="icon-mail"></i>Email
                                        address: {company.email}
                                    </li>
                                )}
                                {company.website && (
                                    <li>
                                        <i className="icon-globe"></i>Website
                                        URL: {company.website}
                                    </li>
                                )}
                            </ul>
                        </div>
                        {job.status === null ? (
                            <div className="intern-application-process">
                                <h3>Application Process</h3>
                                <ul>
                                    <li>
                                        Click the <span>"Apply Now"</span>{" "}
                                        button below.
                                    </li>
                                    <li>
                                        You will be redirected to an application
                                        form.
                                    </li>
                                    <li>
                                        Please upload the following documents in
                                        PDF format:
                                        <ol>
                                            <i className="icon-refresh-cw"></i>
                                            Updated Resume/CV.
                                        </ol>
                                        <ol>
                                            <i className="icon-book-open-text"></i>
                                            Academic Transcript.
                                        </ol>
                                        <ol>
                                            <i className="icon-file-text"></i>
                                            Cover Letter outlining your relevant
                                            skills and experience.
                                        </ol>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                    {loggedUser.role === "Student" &&
                    loggedUser?.academic.registered &&
                    (await canJoinIntern(job._id)) ? (
                        <ApplySection job={job} company={company} />
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
}

const canJoinIntern = async (jobId) => {
    const data = await fetch("http://localhost:3000/api/applications", {
        headers: {
            "auth-token": await getAuthToken(),
        },
    });
    const applications = await data.json();

    return (
        applications.findIndex(
            ({ job, status }) => job._id === jobId && status !== "Rejected"
        ) === -1
    );
};
