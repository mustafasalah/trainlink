"use client";

import Link from "next/link";
import React from "react";
import useLoggedUser from "../hooks/useLoggedUser";

export default function ApplicationRow({
    _id,
    job,
    student,
    applicationDate,
    acceptedByAdmin,
    status,
    onDetails,
}) {
    const loggedUser = useLoggedUser();

    const jobDeleted = !job; // job might be null

    return (
        <tr>
            {/^(Admin|Company)$/.test(loggedUser.role) ? (
                <td>
                    <Link href={`/users/${student._id}`}>
                        {student.fullName}
                    </Link>
                </td>
            ) : (
                ""
            )}

            <td>
                {jobDeleted ? (
                    <span style={{ color: "#999" }}>(Deleted Internship)</span>
                ) : (
                    <Link href={`/interns/${job._id}`}>{job.title}</Link>
                )}
            </td>

            {loggedUser.role === "Admin" ? (
                <td>
                    {jobDeleted ? (
                        <span style={{ color: "#999" }}>
                            (Company Unavailable)
                        </span>
                    ) : (
                        <Link href={`/companies/${job.companyId}`}>
                            {job.companyName}
                        </Link>
                    )}
                </td>
            ) : (
                ""
            )}

            <td>
                <span id={status}>
                    {status}{" "}
                    <span style={{ color: acceptedByAdmin ? "green" : "red" }}>
                        {loggedUser.role === "Admin" && status === "Pending"
                            ? acceptedByAdmin
                                ? "(Reviewed)"
                                : "(Need Review)"
                            : ""}
                    </span>
                </span>
            </td>

            <td>{applicationDate}</td>

            <td>
                <Link
                    href={`/applications?id=${_id}`}
                    onClick={(e) => {
                        e.preventDefault();
                        onDetails();
                    }}
                >
                    Details
                </Link>
            </td>
        </tr>
    );
}
