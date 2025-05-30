"use client";

import React, { useCallback, useState } from "react";
import Modal from "./Modal";

export default function EditProfileSection({ user }) {
    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
    const [skills, setSkills] = useState(user.academic?.skills || "");

    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const [showEditModal, changeShowEditModal] = useState(false);
    const [showPassowrdModal, changeShowPasswordModal] = useState(false);
    const onEditClicked = useCallback(async () => {
        await fetch("https://trainlink.fly.dev/api/users/" + user._id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, phoneNumber, skills }),
        });
        alert("Your Profile Info has been updated successfully!");
        window.location.reload();
    }, [showEditModal, email, phoneNumber, skills]);
    const onEditPasswordClicked = useCallback(
        () => changeShowPasswordModal(!showPassowrdModal),
        [showPassowrdModal]
    );

    return (
        <>
            <div className="buttons">
                <button onClick={() => changeShowEditModal(!showEditModal)}>
                    Edit Profile
                </button>{" "}
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
                        onChange={({ target: { value } }) => {
                            setOldPass(value);
                        }}
                        value={oldPass}
                    />
                </div>
                <div className="new">
                    <div className="new-pass">
                        <h3>New Password</h3>
                        <input
                            type="password"
                            onChange={({ target: { value } }) => {
                                setNewPass(value);
                            }}
                            value={newPass}
                        />
                    </div>
                    <div className="co-pass">
                        <h3>Confirm New Password</h3>
                        <input
                            type="password"
                            onChange={({ target: { value } }) => {
                                setConfirmPass(value);
                            }}
                            value={confirmPass}
                        />
                    </div>
                </div>
                <button
                    className="change"
                    onClick={() => {
                        if (
                            oldPass !== "" &&
                            newPass !== "" &&
                            confirmPass === newPass
                        ) {
                            alert(
                                "Your password has been changed successfully!"
                            );
                            onEditPasswordClicked();
                        } else {
                            alert(
                                "There is an error in the password you entered!"
                            );
                        }
                    }}
                >
                    Change
                </button>{" "}
                <button className="cancel" onClick={onEditPasswordClicked}>
                    Cancel
                </button>
            </Modal>
            <Modal
                title="Edit My Profile"
                show={showEditModal}
                className="edit-form-modal"
                onClose={() => changeShowEditModal(!showEditModal)}
            >
                <div className="student-name">
                    <h3>Student Name</h3>
                    <input type="text" value={user.fullName} readOnly />
                </div>
                <div className="student-id">
                    <h3>Student ID</h3>
                    <input type="text" value={user.studentId} readOnly />
                </div>
                <div className="email">
                    <h3>Email</h3>
                    <input
                        type="email"
                        onChange={({ target: { value } }) => {
                            setEmail(value);
                        }}
                        value={email}
                    />
                </div>
                <div className="phone">
                    <h3>Phone Number</h3>
                    <input
                        type="text"
                        onChange={({ target: { value } }) => {
                            setPhoneNumber(value);
                        }}
                        value={phoneNumber}
                    />
                </div>
                <div className="skills">
                    <h3>Skills / Interests</h3>
                    <textarea
                        name="skills"
                        onChange={({ target: { value } }) => {
                            setSkills(value);
                        }}
                        value={skills}
                    />
                </div>
                <button className="submet" onClick={onEditClicked}>
                    Edit Profile
                </button>{" "}
                <button
                    className="cancel"
                    onClick={() => changeShowEditModal(!showEditModal)}
                >
                    Cancel
                </button>
            </Modal>
        </>
    );
}
