"use client";

import Link from "next/link";
import React from "react";
import useLoggedUser from "../hooks/useLoggedUser";

export default function ApplicationRow({
    _id,
    job,
    student,
    applicationDate,
    status,
}) {
    const loggedUser = useLoggedUser();

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
                <Link href={`/interns/${job._id}`}>{job.title}</Link>
            </td>
            {loggedUser.role === "Admin" ? (
                <td>
                    <Link href={`/companies/${job.companyId}`}>
                        {job.companyName}
                    </Link>
                </td>
            ) : (
                ""
            )}
            <td>
                <span id={status}>{status}</span>
            </td>
            <td>{applicationDate}</td>
            <td>
                <Link href={`/applications?id=${_id}`}>Details</Link>{" "}
            </td>
        </tr>
    );
}
