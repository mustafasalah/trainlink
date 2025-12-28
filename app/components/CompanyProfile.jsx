import Image from "next/image";
import React from "react";
import BackButton from "./BackButton";
import JobCard from "./JobCard";
import { getAuthUser } from "../auth";

export default async function CompanyProfile({
    company,
    jobs,
    withoutTrainingOpportunities = false,
}) {
    const loggedUser = await getAuthUser();

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
                                        <i className="icon-phone"></i>
                                        <b>Phone number:</b>{" "}
                                        {company.phoneNumber}
                                    </li>
                                )}
                                {company.email && (
                                    <li>
                                        <i className="icon-mail"></i>
                                        <b>Email address:</b> {company.email}
                                    </li>
                                )}
                                {company.website && (
                                    <li>
                                        <i className="icon-globe"></i>
                                        <b>Website URL:</b> {company.website}
                                    </li>
                                )}
                            </ul>
                        </div>

                        {loggedUser.role !== "Student" && company.agreement ? (
                            <div className="company-contact-information">
                                <h3>Agreement Details</h3>
                                <ul>
                                    {company.agreement.date && (
                                        <li>
                                            <b>- Agreement Date: </b>
                                            {new Date(
                                                company.agreement.date
                                            ).toDateString()}
                                        </li>
                                    )}
                                    {company.agreement.period && (
                                        <li>
                                            <b>- Period:</b>{" "}
                                            {company.agreement.period}
                                        </li>
                                    )}
                                    {company.agreement.renewal_type && (
                                        <li>
                                            <b>- Renewal Type: </b>
                                            {company.agreement.renewal_type}
                                        </li>
                                    )}
                                    {company.agreement.nature && (
                                        <li>
                                            <b>- Agreement Nature: </b>
                                            {company.agreement.nature}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ) : (
                            ""
                        )}
                        {withoutTrainingOpportunities ? (
                            ""
                        ) : (
                            <div className="company-offerd">
                                <h3>Offered Training Opportunities</h3>

                                {jobs.length ? (
                                    <div className="cards">
                                        {jobs.map((job) => (
                                            <JobCard
                                                key={job._id}
                                                job={job}
                                                hideCompanyName
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p>
                                        there are no training opportunities
                                        offerd by this company yet
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    <BackButton />
                </div>
            </div>
        </div>
    );
}
