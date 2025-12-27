"use client";

import React, { useCallback, useState } from "react";
import JobCard from "./JobCard";
import useLoggedUser from "../hooks/useLoggedUser";
import Modal from "./Modal";
import { useRouter } from "next/navigation";

export default function MyInternsSection({
    internships,
    tabs = ["Active", "Inactive"],
}) {
    const [filter, changeFilter] = useState(null);
    const loggedUser = useLoggedUser();
    const router = useRouter();

    const [showCreateModal, setShowCreateModal] = useState(false);

    // EDIT state
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const handleCloseModal = useCallback(() => setShowCreateModal(false), []);
    const handleOpenModal = useCallback(() => setShowCreateModal(true), []);

    // open edit
    const handleOpenEdit = useCallback((job) => {
        setSelectedJob(job);
        setShowEditModal(true);
    }, []);

    const handleCloseEdit = useCallback(() => {
        setShowEditModal(false);
        setSelectedJob(null);
    }, []);

    // CREATE handler
    const handleCreate = useCallback(
        async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const formData = new FormData(form);

            const photo = formData.get("photo");
            if (!(photo instanceof File) || photo.size === 0) {
                alert("You must upload intern photo first!");
                return;
            }

            try {
                const res = await fetch("/api/jobs", {
                    method: "POST",
                    body: formData,
                });
                if (!res.ok) {
                    let message = "Failed to create intern.";
                    try {
                        const data = await res.json();
                        if (data?.error) message = data.error;
                    } catch (_) {}
                    alert(message);
                    return;
                }

                alert("The Intern has been added successfully.");
                handleCloseModal();
                form.reset();
                router.refresh();
            } catch (err) {
                console.error(err);
                alert("Something went wrong while creating the intern.");
            }
        },
        [handleCloseModal, router]
    );

    // UPDATE handler
    const handleUpdate = useCallback(
        async (event) => {
            event.preventDefault();
            if (!selectedJob?._id) return;

            const form = event.currentTarget;
            const formData = new FormData(form);

            // photo is optional in edit
            const photo = formData.get("photo");
            if (photo instanceof File && photo.size === 0) {
                formData.delete("photo");
            }

            try {
                const res = await fetch(`/api/jobs/${selectedJob._id}`, {
                    method: "PATCH",
                    body: formData,
                });

                if (!res.ok) {
                    let message = "Failed to update internship.";
                    try {
                        const data = await res.json();
                        if (data?.error) message = data.error;
                    } catch (_) {}
                    alert(message);
                    return;
                }

                alert("Internship updated successfully.");
                handleCloseEdit();
                router.refresh();
            } catch (err) {
                console.error(err);
                alert("Something went wrong while updating the internship.");
            }
        },
        [selectedJob, handleCloseEdit, router]
    );

    return (
        <div className="interns-first-content">
            {/* header */}
            <div className="head-title">
                <div className="tabs">
                    <button
                        className={filter === null ? "active" : ""}
                        onClick={() => changeFilter(null)}
                    >
                        All
                    </button>
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={
                                filter === tab.toLowerCase() ? "active" : ""
                            }
                            onClick={() => changeFilter(tab.toLowerCase())}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {loggedUser.role === "Company" && (
                    <div className="buttons">
                        <button onClick={handleOpenModal}>
                            Add New Intern
                        </button>
                    </div>
                )}
            </div>

            {/* cards */}
            <div className="interns-cards">
                {loggedUser.role === "Student"
                    ? internships
                          .filter(({ status }) =>
                              filter === null ? true : status === filter
                          )
                          .reverse()
                          .map(({ application: { job }, status }) => (
                              <JobCard
                                  key={job._id}
                                  job={job}
                                  InternStatus={status}
                              />
                          ))
                    : internships
                          .filter(({ status }) =>
                              filter === null ? true : status === filter
                          )
                          .reverse()
                          .map((intern) => (
                              <JobCard
                                  key={intern._id}
                                  job={intern}
                                  onEdit={handleOpenEdit} // pass edit handler
                              />
                          ))}
            </div>

            {/* CREATE MODAL */}
            {loggedUser.role === "Company" && (
                <form onSubmit={handleCreate}>
                    <Modal
                        title="Add New Intern"
                        show={showCreateModal}
                        className="new-intern-modal"
                        onClose={handleCloseModal}
                    >
                        <input
                            type="hidden"
                            name="companyId"
                            value={loggedUser.companyId || ""}
                        />
                        <input
                            type="hidden"
                            name="companyName"
                            value={loggedUser.companyName || ""}
                        />

                        <div className="new-intern-first">
                            <div className="position-title">
                                <h4>
                                    Position Title{" "}
                                    <i className="icon-asterisk"></i>
                                </h4>
                                <input type="text" name="title" required />
                            </div>

                            <div className="intern-img">
                                <h4>
                                    Intern Poster Image{" "}
                                    <i className="icon-asterisk"></i>
                                </h4>
                                <input
                                    type="file"
                                    name="photo"
                                    accept=".jpeg,.jpg,.png"
                                    required
                                />
                            </div>
                        </div>

                        <div className="description">
                            <h4>
                                Description <i className="icon-asterisk"></i>
                            </h4>
                            <textarea name="description" required />
                        </div>

                        <div className="key-info">
                            <h4>
                                Key Information{" "}
                                <i className="icon-asterisk"></i>
                            </h4>
                            <ul>
                                <li>
                                    <i className="icon-calendar"></i>
                                    Application Deadline:
                                    <input
                                        type="date"
                                        name="deadline"
                                        required
                                    />
                                </li>
                                <li>
                                    <i className="icon-calendar-clock"></i>
                                    Period:
                                    <input type="text" name="period" required />
                                </li>
                                <li>
                                    <i className="icon-layout-grid"></i>
                                    Work Time:
                                    <select
                                        name="workTime"
                                        defaultValue="full-time"
                                        required
                                    >
                                        <option value="full-time">
                                            Full-time
                                        </option>
                                        <option value="part-time">
                                            Part-time
                                        </option>
                                    </select>
                                </li>
                                <li>
                                    <i className="icon-map-pin"></i>
                                    Location:
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                    />
                                </li>
                            </ul>
                        </div>

                        <div className="responsibilities">
                            <h4>
                                Responsibilities{" "}
                                <i className="icon-asterisk"></i>
                            </h4>
                            <textarea name="responsibilities" required />
                        </div>

                        <button
                            className="cancel"
                            type="button"
                            onClick={handleCloseModal}
                        >
                            Cancel
                        </button>
                        <button className="app-ero-submit" type="submit">
                            Create
                        </button>
                    </Modal>
                </form>
            )}

            {/* EDIT MODAL */}
            {loggedUser.role === "Company" && selectedJob && (
                <form onSubmit={handleUpdate}>
                    <Modal
                        title="Edit Intern"
                        show={showEditModal}
                        className="new-intern-modal"
                        onClose={handleCloseEdit}
                    >
                        <input
                            type="hidden"
                            name="companyId"
                            value={loggedUser.companyId || ""}
                        />
                        <input
                            type="hidden"
                            name="companyName"
                            value={loggedUser.companyName || ""}
                        />

                        <div className="new-intern-first">
                            <div className="position-title">
                                <h4>
                                    Position Title{" "}
                                    <i className="icon-asterisk"></i>
                                </h4>
                                <input
                                    type="text"
                                    name="title"
                                    defaultValue={selectedJob.title || ""}
                                    required
                                />
                            </div>

                            <div className="intern-img">
                                <h4>Intern Poster Image (optional)</h4>

                                {/* show current thumbnail */}
                                {selectedJob.thumbnailUrl && (
                                    <div style={{ marginBottom: 8 }}>
                                        <img
                                            src={selectedJob.thumbnailUrl}
                                            alt="Current"
                                            style={{
                                                width: 180,
                                                height: "auto",
                                                borderRadius: 6,
                                            }}
                                        />
                                    </div>
                                )}

                                <input
                                    type="file"
                                    name="photo"
                                    accept=".jpeg,.jpg,.png"
                                />
                            </div>
                        </div>

                        <div className="description">
                            <h4>
                                Description <i className="icon-asterisk"></i>
                            </h4>
                            <textarea
                                name="description"
                                defaultValue={selectedJob.description || ""}
                                required
                            />
                        </div>

                        <div className="key-info">
                            <h4>
                                Key Information{" "}
                                <i className="icon-asterisk"></i>
                            </h4>
                            <ul>
                                <li>
                                    <i className="icon-calendar"></i>
                                    Application Deadline:
                                    <input
                                        type="date"
                                        name="deadline"
                                        defaultValue={new Date(
                                            selectedJob.deadline
                                        )
                                            .toISOString()
                                            .slice(0, 10)}
                                        required
                                    />
                                </li>

                                <li>
                                    <i className="icon-calendar-clock"></i>
                                    Period:
                                    <input
                                        type="text"
                                        name="period"
                                        defaultValue={selectedJob.period || ""}
                                        required
                                    />
                                </li>

                                <li>
                                    <i className="icon-layout-grid"></i>
                                    Work Time:
                                    <select
                                        name="workTime"
                                        defaultValue={
                                            selectedJob.workTime || "full-time"
                                        }
                                        required
                                    >
                                        <option value="full-time">
                                            Full-time
                                        </option>
                                        <option value="part-time">
                                            Part-time
                                        </option>
                                    </select>
                                </li>

                                <li>
                                    <i className="icon-map-pin"></i>
                                    Location:
                                    <input
                                        type="text"
                                        name="location"
                                        defaultValue={
                                            selectedJob.location || ""
                                        }
                                        required
                                    />
                                </li>
                            </ul>
                        </div>

                        <div className="responsibilities">
                            <h4>
                                Responsibilities{" "}
                                <i className="icon-asterisk"></i>
                            </h4>
                            <textarea
                                name="responsibilities"
                                defaultValue={
                                    selectedJob.responsibilities || ""
                                }
                                required
                            />
                        </div>

                        <button
                            className="cancel"
                            type="button"
                            onClick={handleCloseEdit}
                        >
                            Cancel
                        </button>
                        <button className="app-ero-submit" type="submit">
                            Update
                        </button>
                    </Modal>
                </form>
            )}
        </div>
    );
}
