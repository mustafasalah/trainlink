"use client";

import React, { useCallback, useState } from "react";
import Modal from "./Modal";

export default function EditProfileSection() {
    const [showEditModal, changeShowEditModal] = useState(false);
    const [showPassowrdModal, changeShowPasswordModal] = useState(false);
    const onEditClicked = useCallback(
        () => changeShowEditModal(!showEditModal),
        [showEditModal]
    );
    const onEditPasswordClicked = useCallback(
        () => changeShowPasswordModal(!showPassowrdModal),
        [showPassowrdModal]
    );
    return (
        <>
            <div className="buttons">
                <button onClick={onEditClicked}>Edit Profile</button>{" "}
                <button onClick={onEditPasswordClicked}>Change Password</button>
            </div>
            <Modal
                title="Change My Password"
                show={showPassowrdModal}
                className="password-form-modal"
                onClose={onEditPasswordClicked}
            >
                <div className="old-pass">
                    <h3>Old Password</h3>
                    <input
                        type="password"
                        onChange={() => {}}
                        value="12345678"
                    />
                </div>
                <div className="new">
                    <div className="new-pass">
                        <h3>New Password</h3>
                        <input
                            type="password"
                            onChange={() => {}}
                            value="rashasalah"
                        />
                    </div>
                    <div className="co-pass">
                        <h3>Confirm New Password</h3>
                        <input
                            type="password"
                            onChange={() => {}}
                            value="rashasalah"
                        />
                    </div>
                </div>
                <button className="change">Change</button>{" "}
                <button className="cancel" onClick={onEditPasswordClicked}>
                    Cancel
                </button>
            </Modal>
            <Modal
                title="Edit My Profile"
                show={showEditModal}
                className="edit-form-modal"
                onClose={onEditClicked}
            >
                <div className="student-name">
                    <h3>Student Name</h3>
                    <input type="text" value="Rasha Salah Alnour" readOnly />
                </div>
                <div className="student-id">
                    <h3>Student ID</h3>
                    <input type="text" value="201822000554" readOnly />
                </div>
                <div className="email">
                    <h3>Email</h3>
                    <input
                        type="email"
                        onChange={() => {}}
                        value="rashasalah2911@gmail.com"
                    />
                </div>
                <div className="phone">
                    <h3>Phone Number</h3>
                    <input
                        type="text"
                        onChange={() => {}}
                        value="+249 912 345 678"
                    />
                </div>
                <div className="skills">
                    <h3>Skills / Interests</h3>
                    <textarea
                        name="skills"
                        onChange={() => {}}
                        value={`Web Development, Database Management, Network Fundamentals, Programming Python, Java, UI/UX design`}
                    />
                </div>
                <button className="submet" onClick={onEditClicked}>
                    Edit Profile
                </button>{" "}
                <button className="cancel" onClick={onEditClicked}>
                    Cancel
                </button>
            </Modal>
        </>
    );
}
