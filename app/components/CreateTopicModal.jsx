"use client";

import React, { useCallback, useState } from "react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import useLoggedUser from "../hooks/useLoggedUser";

export default function CreateTopicModal() {
    const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);
    const showModal = useCallback(() => setShowCreateTopicModal(true), []);
    const hideModal = useCallback(() => setShowCreateTopicModal(false), []);
    const loggedUser = useLoggedUser();
    const router = useRouter();

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            console.log(loggedUser);
            if (!loggedUser || !loggedUser.id) {
                alert("You must be logged in to create a topic.");
                return;
            }

            const form = event.currentTarget;
            const formData = new FormData(form);

            const title = (formData.get("title") || "").toString().trim();
            const category = (formData.get("category") || "").toString();
            const message = (formData.get("message") || "").toString().trim();

            if (!title || !message) {
                alert("Please fill in all required fields.");
                return;
            }

            try {
                const res = await fetch("/api/forum/topics", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title,
                        category,
                        message,
                        authorId: loggedUser.id,
                        authorName:
                            loggedUser.fullName || loggedUser.username || "",
                    }),
                });

                if (!res.ok) {
                    let msg = "Failed to create topic.";
                    try {
                        const data = await res.json();
                        if (data.error) msg = data.error;
                    } catch (_) {}
                    alert(msg);
                    return;
                }

                alert("Topic posted successfully.");
                form.reset();
                hideModal();
                router.refresh(); // reload forum topics
            } catch (err) {
                console.error(err);
                alert("Something went wrong while creating the topic.");
            }
        },
        [hideModal, loggedUser, router]
    );

    return (
        <>
            <button onClick={showModal}>Create a New Topic</button>

            <Modal
                title="Start a New Discussion"
                show={showCreateTopicModal}
                className="new-forum"
                onClose={hideModal}
            >
                <form onSubmit={handleSubmit}>
                    <div className="box-title">
                        <h4>
                            Topic Title <span style={{ color: "red" }}>*</span>
                        </h4>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter your topic here..."
                            required
                        />
                    </div>

                    <div className="list-category">
                        <h4>
                            Category <span style={{ color: "red" }}>*</span>
                        </h4>
                        <select
                            name="category"
                            defaultValue="General Discussion"
                            required
                        >
                            <option value="General Discussion">
                                General Discussion
                            </option>
                            <option value="Academic Support">
                                Academic Support
                            </option>
                        </select>
                    </div>

                    <div className="box-mess">
                        <h4>
                            Message <span style={{ color: "red" }}>*</span>
                        </h4>
                        <textarea
                            name="message"
                            placeholder="Write your message here..."
                            required
                        />
                    </div>

                    <button className="change" type="submit">
                        Post Topic
                    </button>
                    <button
                        className="cancel"
                        type="button"
                        onClick={hideModal}
                        style={{ marginLeft: "8px" }}
                    >
                        Cancel
                    </button>
                </form>
            </Modal>
        </>
    );
}
