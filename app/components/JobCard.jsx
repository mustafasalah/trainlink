"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useCallback } from "react";
import { format } from "timeago.js";
import useLoggedUser from "../hooks/useLoggedUser";
import { useRouter } from "next/navigation";

export default function JobCard({
    job,
    InternStatus = null,
    hideCompanyName = false,
}) {
    const loggedUser = useLoggedUser();
    const router = useRouter();

    const isOwner =
        loggedUser.role === "Company" && loggedUser.companyId === job.companyId;

    // DELETE HANDLER
    const handleDelete = useCallback(async () => {
        const yes = confirm(`Are you sure you want to delete "${job.title}"?`);
        if (!yes) return;

        try {
            const res = await fetch(`/api/internships/${job._id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                let msg = "Failed to delete this internship.";
                try {
                    const data = await res.json();
                    if (data.error) msg = data.error;
                } catch (_) {}
                alert(msg);
                return;
            }

            alert("Internship deleted successfully.");
            router.refresh();
        } catch (err) {
            console.error(err);
            alert("Something went wrong while deleting.");
        }
    }, [job._id, job.title, router]);

    // TOGGLE STATUS HANDLER (active <-> inactive)
    const handleToggleStatus = useCallback(async () => {
        const current = job.status || "inactive";
        const nextStatus = current === "active" ? "inactive" : "active";

        const yes = confirm(
            `Are you sure you want to set this internship to "${nextStatus}"?`
        );
        if (!yes) return;

        try {
            const res = await fetch(`/api/internships/${job._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: nextStatus }),
            });

            if (!res.ok) {
                let msg = "Failed to update internship status.";
                try {
                    const data = await res.json();
                    if (data.error) msg = data.error;
                } catch (_) {}
                alert(msg);
                return;
            }

            alert(`Internship status updated to "${nextStatus}".`);
            router.refresh();
        } catch (err) {
            console.error(err);
            alert("Something went wrong while updating status.");
        }
    }, [job._id, job.status, router]);

    const statusLabel =
        InternStatus ||
        (job.status
            ? job.status.charAt(0).toUpperCase() + job.status.slice(1)
            : "");

    const statusClass =
        InternStatus?.toLowerCase() ||
        (job.status ? job.status.toLowerCase() : "");

    const toggleButtonLabel =
        job.status === "active" ? "Deactivate" : "Activate";

    return (
        <div className="card">
            <div className="card-img" style={{ position: "relative" }}>
                <Image src={job.thumbnailUrl} alt="" width={280} height={120} />

                {statusLabel && (
                    <span className={statusClass}>{statusLabel}</span>
                )}

                <p>{job.title}</p>

                {/* OWNER CONTROLS */}
                {isOwner && (
                    <div
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            display: "flex",
                            gap: "8px",
                        }}
                    >
                        <button
                            type="button"
                            onClick={handleToggleStatus}
                            style={{
                                background:
                                    job.status === "active"
                                        ? "#f59e0b"
                                        : "#16a34a",
                                color: "white",
                                border: "none",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                            }}
                        >
                            {toggleButtonLabel}
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            style={{
                                background: "#dc2626",
                                color: "white",
                                border: "none",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                            }}
                        >
                            <i className="icon-trash"></i>
                        </button>
                    </div>
                )}
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
