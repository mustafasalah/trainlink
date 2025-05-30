"use client";

import React, { useCallback, useState } from "react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";

export default function ApplySection({ job, company }) {
    const [showApplyModal, changeShowApplyModal] = useState(false);
    const router = useRouter();

    const onApplyClicked = useCallback(async () => {
        await fetch("http://localhost:3000/api/applications/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: job.title, jobId: job._id }),
        });
        alert("Your Application has been submitted successfully!");
        setSuccess(true);
        router.push("/applications");
    }, [job]);

    const [success, setSuccess] = useState(false);

    return (
        <>
            <button
                disabled={success}
                style={success ? { backgroundColor: "gray" } : {}}
                onClick={() => changeShowApplyModal(!showApplyModal)}
            >
                Apply Now
            </button>
            <Modal
                title="Application Form"
                show={showApplyModal}
                className="edit-form-modal"
                onClose={() => changeShowApplyModal(!showApplyModal)}
            >
                <div className="student-name">
                    <h3>Company Name</h3>
                    <input type="text" value={company.name} readOnly />
                </div>
                <div className="student-id">
                    <h3>Opportunity Name</h3>
                    <input type="text" value={job.title} readOnly />
                </div>
                <div className="email">
                    <h3>Your CV/Resume</h3>
                    <input type="file" onChange={() => {}} />
                </div>
                <div className="phone">
                    <h3>Cover letter</h3>
                    <input type="file" onChange={() => {}} />
                </div>
                <button className="submet" onClick={onApplyClicked}>
                    Submit Form
                </button>{" "}
                <button
                    className="cancel"
                    onClick={() => changeShowApplyModal(!showApplyModal)}
                >
                    Cancel
                </button>
            </Modal>
        </>
    );
}
