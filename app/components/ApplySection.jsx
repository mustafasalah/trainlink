"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import useLoggedUser from "../hooks/useLoggedUser"; // Assuming this hook provides logged user data
import { applyForJob } from "@/app/actions/applicationActions"; // <--- Import your Server Action
import Modal from "./Modal";

export default function ApplySection({ job, company }) {
    const [showApplyModal, changeShowApplyModal] = useState(false);
    const [loading, setLoading] = useState(false); // To show loading state during submission
    const [submissionMessage, setSubmissionMessage] = useState(""); // For user feedback
    const [success, setSuccess] = useState(false); // To disable button after successful submission

    const router = useRouter();
    const loggedUser = useLoggedUser(); // This hook should return null or a user object

    // State for selected files (optional, but good for displaying file names to user)
    const [resumeFile, setResumeFile] = useState(null);
    const [coverLetterFile, setCoverLetterFile] = useState(null);

    // Ensure loggedUser is not null before accessing properties
    const isRegistered =
        loggedUser && loggedUser.academic && loggedUser.academic.registered;

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault(); // Prevent default form submission

            if (!loggedUser || loggedUser.role !== "Student") {
                setSubmissionMessage(
                    "Error: You must be logged in as a student to apply."
                );
                return;
            }

            if (!job || !job._id) {
                setSubmissionMessage("Error: Job information is missing.");
                return;
            }

            if (!resumeFile || !coverLetterFile) {
                setSubmissionMessage(
                    "Error: Please upload both your CV/Resume and Cover Letter."
                );
                return;
            }

            setLoading(true);
            setSubmissionMessage("Submitting your application...");

            const formData = new FormData();
            formData.append("jobId", job._id);
            formData.append("resume", resumeFile);
            formData.append("coverLetter", coverLetterFile);

            try {
                const result = await applyForJob(formData); // Call the Server Action

                if (result.success) {
                    setSubmissionMessage(result.message);
                    setSuccess(true); // Disable apply button
                    // Optionally close modal after a short delay
                    setTimeout(() => {
                        changeShowApplyModal(false);
                        router.push("/applications"); // Redirect to applications page
                    }, 1500);
                } else {
                    setSubmissionMessage(`Error: ${result.message}`);
                    // Keep modal open to show error
                }
            } catch (error) {
                console.error(
                    "Client-side error during application submission:",
                    error
                );
                setSubmissionMessage(
                    "An unexpected error occurred. Please try again."
                );
            } finally {
                setLoading(false);
            }
        },
        [loggedUser, job, resumeFile, coverLetterFile, router]
    );

    return (
        <>
            <button
                disabled={success || !isRegistered || loading} // Disable if success, not registered, or loading
                style={
                    success || !isRegistered || loading
                        ? { backgroundColor: "gray", cursor: "not-allowed" }
                        : {}
                }
                onClick={() => {
                    if (!success && isRegistered && !loading) {
                        changeShowApplyModal(true);
                        setSubmissionMessage(""); // Clear previous messages when opening modal
                        setResumeFile(null); // Clear selected files
                        setCoverLetterFile(null);
                    }
                }}
            >
                {loading
                    ? "Applying..."
                    : success
                    ? "Applied!"
                    : isRegistered
                    ? "Apply Now"
                    : "Please register yourself in college first."}
            </button>
            <Modal
                title="Application Form"
                show={showApplyModal}
                className="edit-form-modal"
                onClose={() => changeShowApplyModal(false)}
            >
                <form
                    onSubmit={handleSubmit}
                    className="edit-form-modal-content"
                >
                    <div className="student-name">
                        <h3>Company Name</h3>
                        <input
                            type="text"
                            value={company?.name || ""}
                            readOnly
                        />
                    </div>
                    <div className="student-id">
                        <h3>Opportunity Name</h3>
                        <input type="text" value={job?.title || ""} readOnly />
                    </div>

                    <input type="hidden" name="jobId" value={job?._id || ""} />

                    <div className="email">
                        <h3>Your CV/Resume</h3>
                        <input
                            type="file"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                                setResumeFile(
                                    e.target.files ? e.target.files[0] : null
                                );
                                setSubmissionMessage("");
                            }}
                            required
                        />
                        {resumeFile && (
                            <p className="file-name">
                                Selected: {resumeFile.name}
                            </p>
                        )}
                    </div>
                    <div className="phone">
                        <h3>Cover letter</h3>
                        <input
                            type="file"
                            name="coverLetter" // <--- Add name attribute
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                                setCoverLetterFile(
                                    e.target.files ? e.target.files[0] : null
                                );
                                setSubmissionMessage(""); // Clear message on file change
                            }}
                            required
                        />
                        {coverLetterFile && (
                            <p className="file-name">
                                Selected: {coverLetterFile.name}
                            </p>
                        )}
                    </div>

                    {submissionMessage && (
                        <p
                            style={{
                                color: success ? "green" : "red",
                                marginTop: "16px",
                                flexBasis: "100%",
                                textAlign: "center",
                            }}
                        >
                            {submissionMessage}
                        </p>
                    )}

                    <button className="submet" type="submit" disabled={loading}>
                        {" "}
                        {loading ? "Submitting..." : "Submit Form"}
                    </button>
                    <button
                        className="cancel"
                        type="button" // Use type="button" to prevent form submission
                        onClick={() => changeShowApplyModal(false)}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </form>
            </Modal>
        </>
    );
}
