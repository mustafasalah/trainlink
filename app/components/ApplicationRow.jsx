import Link from "next/link";
import React from "react";

export default function ApplicationRow({ id, title, status, datetime }) {
    return (
        <tr>
            <td>
                <Link href={`/applications?id=${id}`}>{title}</Link>
            </td>
            <td>
                <span id={status}>{status}</span>
            </td>
            <td>{datetime}</td>
            <td>
                <Link href={`/applications?id=${id}`}>Details</Link>{" "}
            </td>
        </tr>
    );
}
