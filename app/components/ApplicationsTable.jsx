"use client";

import React, { useCallback, useState } from "react";
import ApplicationRow from "./ApplicationRow";
import useLoggedUser from "../hooks/useLoggedUser";
import Modal from "./Modal";
import Link from "next/link";
import { getFilename, formatDate } from "../functions";
import {
    acceptApplicationByAdmin,
    acceptApplicationByCompany,
    rejectApplicationByAdmin,
    rejectApplicationByCompany,
} from "../services/ApplicationService";
import { useRouter } from "next/navigation";

export default function ApplicationsTable({ applications }) {
    const loggedUser = useLoggedUser();
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const router = useRouter();

    const handleAccept = useCallback(async () => {
        try {
            if (loggedUser.role === "Admin") {
                await acceptApplicationByAdmin(selectedApplication._id);
            } else {
                await acceptApplicationByCompany(selectedApplication._id);
            }
            alert("The Application has been accepted successfully.");
            handleCloseModal();
            router.refresh();
        } catch (err) {
            alert(err);
        }
    }, [router, selectedApplication]);

    const handleReject = useCallback(async () => {
        try {
            const reason = prompt("Rejection Reason:");
            if (loggedUser.role === "Admin") {
                await rejectApplicationByAdmin(selectedApplication._id, reason);
            } else {
                await rejectApplicationByCompany(
                    selectedApplication._id,
                    reason
                );
            }
            alert("The Application has been rejected successfully.");
            handleCloseModal();
            router.refresh();
        } catch (err) {
            alert(err);
        }
    }, [router, selectedApplication]);

    const handleCloseModal = useCallback(() => {
        setSelectedApplication(null);
        setShowDetailsModal(false);
    });

    return (
        <div className="apps-form">
            <table>
                <thead>
                    <tr>
                        {/^(Admin|Company)$/.test(loggedUser.role) ? (
                            <td>Student</td>
                        ) : (
                            ""
                        )}
                        <td>Opportunity</td>
                        {loggedUser.role === "Admin" ? (
                            <>
                                <td>Company</td>
                            </>
                        ) : (
                            ""
                        )}
                        <td>Status</td>
                        <td>Application Date</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {applications
                        .filter((application) => {
                            if (loggedUser.role === "Company")
                                return application.acceptedByAdmin;
                            return true;
                        })
                        .reverse()
                        .map((application) => (
                            <ApplicationRow
                                key={application._id}
                                onDetails={() => {
                                    setSelectedApplication(application);
                                    setShowDetailsModal(true);
                                }}
                                {...application}
                            />
                        ))}
                    {applications.length === 0
                        ? "You don't have any applications yet."
                        : ""}
                </tbody>
            </table>
            <Modal
                title="Application Details"
                show={showDetailsModal}
                className="app-modal"
                onClose={handleCloseModal}
            >
                <>
                    <div className="box">
                        <label>
                            <i className="icon-circle-user-round"></i>Student
                            Name
                        </label>
                        <input
                            type="text"
                            value={selectedApplication?.student.fullName || ""}
                            readOnly
                        />
                    </div>
                    <div className="box">
                        <label>
                            <i className="icon-building-2"></i>Company Name
                        </label>
                        <input
                            type="text"
                            value={selectedApplication?.job.companyName || ""}
                            readOnly
                        />
                    </div>
                    <div className="box full-width">
                        <label>
                            <i className="icon-graduation-cap"></i>Opportunity
                            Name
                        </label>
                        <input
                            type="text"
                            value={selectedApplication?.job.title || ""}
                            readOnly
                        />
                    </div>
                    <div className="box">
                        <label>
                            <i className="icon-calendar-days"></i>Application
                            Date
                        </label>
                        <input
                            type="text"
                            value={formatDate(
                                selectedApplication?.applicationDate
                            )}
                            readOnly
                        />
                    </div>
                    <div className="box">
                        <label>
                            <i className="icon-circle-dashed"></i>Application
                            Status
                        </label>
                        <input
                            type="text"
                            value={selectedApplication?.status || ""}
                            readOnly
                        />
                    </div>
                    <div className="box">
                        <label>
                            <i className="icon-file-badge"></i>Student Resume
                        </label>
                        <div className="box-file">
                            <span>
                                {getFilename(selectedApplication?.resumeUrl)}
                            </span>
                            <Link
                                className="button"
                                style={{ color: "#fff" }}
                                href={selectedApplication?.resumeUrl || ""}
                                target="_blank"
                            >
                                Download
                            </Link>
                        </div>
                    </div>

                    <div className="box">
                        <label>
                            <i className="icon-file-text"></i>Cover Letter
                        </label>
                        <div className="box-file">
                            <span>
                                {getFilename(
                                    selectedApplication?.coverLetterUrl
                                )}
                            </span>
                            <Link
                                className="button"
                                style={{ color: "#fff" }}
                                href={selectedApplication?.coverLetterUrl || ""}
                                target="_blank"
                            >
                                Download
                            </Link>
                        </div>
                    </div>
                    {selectedApplication?.status === "Rejected" &&
                    selectedApplication?.notes ? (
                        <div className="box full-width">
                            <label htmlFor="reason">
                                Reason for Rejection{" "}
                            </label>
                            <textarea
                                name="reason"
                                id="reason"
                                value={selectedApplication.notes}
                            />
                        </div>
                    ) : (
                        ""
                    )}
                    {!/^(Student|ERO)$/.test(loggedUser.role) ? (
                        <>
                            {!selectedApplication?.acceptedByAdmin ||
                            (loggedUser.role === "Company" &&
                                selectedApplication.status === "Pending") ? (
                                <button
                                    className="submet"
                                    onClick={handleAccept}
                                >
                                    Accept
                                </button>
                            ) : (
                                ""
                            )}

                            {selectedApplication?.status === "Pending" ? (
                                <button
                                    className="cancel"
                                    onClick={handleReject}
                                >
                                    Reject
                                </button>
                            ) : (
                                ""
                            )}
                        </>
                    ) : (
                        ""
                    )}
                </>
            </Modal>
        </div>
    );
}
