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
    const jobExists = !!job;

    return (
        <tr>
            {/^(Admin|Company|ERO)$/.test(loggedUser.role) ? (
                <td>
                    {student?._id ? (
                        <Link href={`/users/${student._id}`}>
                            {student.fullName}
                        </Link>
                    ) : (
                        <span>Unknown Student</span>
                    )}
                </td>
            ) : (
                ""
            )}

            <td>
                {jobExists ? (
                    <Link href={`/interns/${job._id}`}>{job.title}</Link>
                ) : (
                    <span style={{ color: "#b91c1c" }}>
                        (Deleted Opportunity)
                    </span>
                )}
            </td>

            {/^(Admin|ERO)$/.test(loggedUser.role) ? (
                <td>
                    {jobExists ? (
                        <Link href={`/companies/${job.companyId}`}>
                            {job.companyName}
                        </Link>
                    ) : (
                        <span style={{ color: "#6b7280" }}>—</span>
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
