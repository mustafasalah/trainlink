"use client";

import React, { useCallback, useState } from "react";
import Modal from "./Modal";

export default function CreateTopicModal() {
    const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);
    const showModal = useCallback(() => setShowCreateTopicModal(true), []);
    const hideModal = useCallback(() => setShowCreateTopicModal(false), []);

    return (
        <>
            <button onClick={showModal}>Create a New Topic</button>

            <Modal
                title="Start a New Discussion"
                show={showCreateTopicModal}
                className="new-forum"
                onClose={hideModal}
            >
                <div className="box-title">
                    <h4>
                        Topic Title <span style={{ color: "red" }}>*</span>
                    </h4>
                    <input type="text" placeholder="Enter your topic here..." />
                </div>
                <div className="list-category">
                    <h4>
                        Category <span style={{ color: "red" }}>*</span>
                    </h4>
                    <form action="select">
                        <select name="category" id="">
                            <option value="General Discussion">
                                General Discussion
                            </option>
                            <option value="Academic Support">
                                Academic Support
                            </option>
                        </select>
                    </form>
                </div>
                <div className="box-mess">
                    <h4>
                        Message <span style={{ color: "red" }}>*</span>
                    </h4>
                    <textarea placeholder="Write your message here..."></textarea>
                </div>
                <button
                    className="change"
                    onClick={() => {
                        //handleSubmit();
                    }}
                >
                    Post Topic
                </button>{" "}
                <button className="cancel" onClick={hideModal}>
                    Cancel
                </button>
            </Modal>
        </>
    );
}
