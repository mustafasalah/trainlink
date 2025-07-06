import Image from "next/image";
import React from "react";
import BackButton from "./BackButton";
import JobCard from "./JobCard";

export default function CompanyProfile({ company, jobs }) {
    return (
        <div className="content">
            <div className="company-details">
                <div className="company-details-card">
                    <div className="company-details-img">
                        <Image
                            src={company.thumbnailUrl}
                            alt=""
                            width="1035"
                            height="250"
                        />
                        <p>{company.name}</p>
                    </div>
                    <div className="company-details-info">
                        <div className="company-about">
                            <h3>About</h3>
                            <p>{company.about}</p>
                        </div>
                        <div className="company-contact-information">
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
                        <div className="company-offerd">
                            <h3>Offered Training Opportunities</h3>

                            {jobs.length ? (
                                <div className="cards">
                                    {jobs.map((job) => (
                                        <JobCard
                                            key={job._id}
                                            intern={job}
                                            hideCompanyName
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p>
                                    there are no training opportunities offerd
                                    by this company yet
                                </p>
                            )}
                        </div>
                    </div>
                    <BackButton />
                </div>
            </div>
        </div>
    );
}
