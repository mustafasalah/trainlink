"use client";

import React, { useCallback, useState } from "react";
import Modal from "./Modal";
import { getAuthToken } from "../auth";

export default function EditProfileSection({ user, company = null }) {
    // Common fields (User)
    const [email, setEmail] = useState(user.email || "");
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");

    // Student-only
    const [skills, setSkills] = useState(user.academic?.skills || "");

    // Company-only (Company model)
    const [website, setWebsite] = useState(company?.website || "");

    // Password states
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    // Modals
    const [showEditModal, changeShowEditModal] = useState(false);
    const [showPassowrdModal, changeShowPasswordModal] = useState(false);

    // UPDATE PROFILE (Student OR Company)
    const onEditClicked = useCallback(async () => {
        try {
            // Company: update User + Company together
            if (user.role === "Company") {
                const res = await fetch(
                    "http://localhost:3000/api/profile/company",
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": await getAuthToken(),
                        },
                        body: JSON.stringify({
                            email,
                            phoneNumber,
                            website,
                        }),
                    }
                );

                let data = {};
                try {
                    data = await res.json();
                } catch (_) {}

                if (!res.ok) {
                    alert(data?.error || "Failed to update company profile.");
                    return;
                }

                alert(
                    "Your Company Profile Info has been updated successfully!"
                );
                window.location.reload();
                return;
            }

            // Student (or other roles): update User only
            const res = await fetch("http://localhost:3000/api/profile/user", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": await getAuthToken(),
                },
                body: JSON.stringify({
                    email,
                    phoneNumber,
                    skills,
                }),
            });

            let data = {};
            try {
                data = await res.json();
            } catch (_) {}

            if (!res.ok) {
                alert(data?.error || "Failed to update profile.");
                return;
            }

            alert("Your Profile Info has been updated successfully!");
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Something went wrong while updating profile.");
        }
    }, [user.role, email, phoneNumber, skills, website]);

    const onEditPasswordClicked = useCallback(async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/api/change-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": await getAuthToken(),
                    },
                    body: JSON.stringify({ oldPass, newPass, confirmPass }),
                }
            );

            const msg = await response.text();
            alert(msg);

            if (response.status === 200) {
                changeShowPasswordModal(false);
                setOldPass("");
                setNewPass("");
                setConfirmPass("");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong while changing password.");
        }
    }, [oldPass, newPass, confirmPass]);

    return (
        <>
            <div className="buttons">
                <button onClick={() => changeShowEditModal(true)}>
                    Edit Profile
                </button>{" "}
                <button onClick={() => changeShowPasswordModal(true)}>
                    Change Password
                </button>
            </div>

            {/* PASSWORD MODAL */}
            <Modal
                title="Change My Password"
                show={showPassowrdModal}
                className="password-form-modal"
                onClose={() => changeShowPasswordModal(false)}
            >
                <div className="old-pass">
                    <h3>Old Password</h3>
                    <input
                        type="password"
                        onChange={({ target: { value } }) => setOldPass(value)}
                        value={oldPass}
                    />
                </div>
                <div className="new">
                    <div className="new-pass">
                        <h3>New Password</h3>
                        <input
                            type="password"
                            onChange={({ target: { value } }) =>
                                setNewPass(value)
                            }
                            value={newPass}
                        />
                    </div>

                    <div className="co-pass">
                        <h3>Confirm New Password</h3>
                        <input
                            type="password"
                            onChange={({ target: { value } }) =>
                                setConfirmPass(value)
                            }
                            value={confirmPass}
                        />
                    </div>
                </div>
                <button className="change" onClick={onEditPasswordClicked}>
                    Change
                </button>{" "}
                <button
                    className="cancel"
                    onClick={() => changeShowPasswordModal(false)}
                >
                    Cancel
                </button>
            </Modal>

            {/* EDIT PROFILE MODAL */}
            <Modal
                title="Edit My Profile"
                show={showEditModal}
                className="edit-form-modal"
                onClose={() => changeShowEditModal(false)}
            >
                <div
                    className="student-name"
                    style={user.role !== "Student" ? { width: "100%" } : null}
                >
                    <h3>{user.role} Name</h3>
                    <input
                        type="text"
                        value={user.fullName}
                        style={
                            user.role !== "Student" ? { width: "100%" } : null
                        }
                        readOnly
                    />
                </div>
                {user.role === "Student" ? (
                    <div className="student-id">
                        <h3>Student ID</h3>
                        <input
                            type="text"
                            value={user.studentId || ""}
                            readOnly
                        />
                    </div>
                ) : (
                    ""
                )}
                <div className="email">
                    <h3>Email</h3>
                    <input
                        type="email"
                        onChange={({ target: { value } }) => setEmail(value)}
                        value={email}
                    />
                </div>
                <div className="phone">
                    <h3>Phone Number</h3>
                    <input
                        type="text"
                        onChange={({ target: { value } }) =>
                            setPhoneNumber(value)
                        }
                        value={phoneNumber}
                    />
                </div>
                {/* Company-only Website */}
                {user.role === "Company" ? (
                    <div className="website email" style={{ width: "100%" }}>
                        <h3>Website</h3>
                        <input
                            type="text"
                            onChange={({ target: { value } }) =>
                                setWebsite(value)
                            }
                            value={website}
                            placeholder="https://example.com"
                            style={{ width: "100%" }}
                        />
                    </div>
                ) : (
                    ""
                )}
                {/* Student-only Skills */}
                {user.role === "Student" ? (
                    <div className="skills">
                        <h3>Skills / Interests</h3>
                        <textarea
                            name="skills"
                            onChange={({ target: { value } }) =>
                                setSkills(value)
                            }
                            value={skills}
                        />
                    </div>
                ) : (
                    ""
                )}
                <button className="submet" onClick={onEditClicked}>
                    Edit Profile
                </button>{" "}
                <button
                    className="cancel"
                    onClick={() => changeShowEditModal(false)}
                >
                    Cancel
                </button>
            </Modal>
        </>
    );
}
