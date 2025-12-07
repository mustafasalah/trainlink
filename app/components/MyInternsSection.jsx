"use client";

import React, { useCallback, useState } from "react";
import JobCard from "./JobCard";
import useLoggedUser from "../hooks/useLoggedUser";
import Modal from "./Modal";
import { useRouter } from "next/navigation";

export default function MyInternsSection({
    internships,
    tabs = ["Ongoing", "Finished"],
}) {
    const [filter, changeFilter] = useState(null);
    const loggedUser = useLoggedUser();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const router = useRouter();

    const handleCloseModal = useCallback(() => {
        setShowCreateModal(false);
    });

    const handleOpenModal = useCallback(() => {
        setShowCreateModal(true);
    });

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
                const res = await fetch("/api/internships", {
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

    return (
        <div className="interns-first-content">
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
                            className={filter === tab ? "active" : ""}
                            onClick={() => changeFilter(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                {loggedUser.role === "Company" ? (
                    <div className="buttons">
                        <button onClick={handleOpenModal}>
                            Add New Intern
                        </button>
                    </div>
                ) : (
                    ""
                )}
            </div>
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
                              <JobCard key={intern._id} job={intern} />
                          ))}
                {internships.length === 0 ? (
                    <>
                        <span>You don't have any internship yet.</span>
                        <br /> <br />
                    </>
                ) : (
                    ""
                )}
            </div>

            {loggedUser.role === "Company" && (
                <form onSubmit={handleCreate}>
                    <Modal
                        title="Add New Intern"
                        show={showCreateModal}
                        className="new-intern-modal"
                        onClose={handleCloseModal}
                    >
                        {/* Hidden fields for company identity */}
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
                                    Position Title
                                    <i className="icon-asterisk"></i>
                                </h4>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="e.g., Full Stack Developer Intern"
                                    required
                                />
                            </div>
                            <div className="intern-img">
                                <h4>
                                    Intern Poster Image
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
                                Description
                                <i className="icon-asterisk"></i>
                            </h4>
                            <textarea
                                name="description"
                                placeholder="Describe the internship role..."
                                required
                            />
                        </div>

                        <div className="key-info">
                            <h4>
                                Key Information
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
                                    <input
                                        type="text"
                                        name="period"
                                        placeholder="e.g., 8 weeks"
                                        required
                                    />
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
                                        placeholder="e.g., Khartoum, Sudan"
                                        required
                                    />
                                </li>
                            </ul>
                        </div>

                        <div className="responsibilities">
                            <h4>
                                Responsibilities
                                <i className="icon-asterisk"></i>
                            </h4>
                            <textarea
                                name="responsibilities"
                                placeholder="List the key responsibilities..."
                                required
                            />
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
        </div>
    );
}
