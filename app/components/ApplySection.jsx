"use client";

import React, { useCallback, useState } from "react";
import Modal from "./Modal";

export default function ApplySection({ job, company }) {
    const [showApplyModal, changeShowApplyModal] = useState(false);
    const onApplyClicked = useCallback(
        () => changeShowApplyModal(!showApplyModal),
        [showApplyModal]
    );
    const [success, setSuccess] = useState(false);

    return (
        <>
            <button
                disabled={success}
                style={success ? { backgroundColor: "gray" } : {}}
                onClick={onApplyClicked}
            >
                Apply Now
            </button>
            <Modal
                title="Application Form"
                show={showApplyModal}
                className="edit-form-modal"
                onClose={onApplyClicked}
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
                <button
                    className="submet"
                    onClick={() => {
                        onApplyClicked();
                        alert(
                            "Your Application has been submitted successfully!"
                        );
                        setSuccess(true);
                    }}
                >
                    Submit Form
                </button>{" "}
                <button className="cancel" onClick={onApplyClicked}>
                    Cancel
                </button>
            </Modal>
        </>
    );
}
