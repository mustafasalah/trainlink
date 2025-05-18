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
                className="edit-form-modal"
                onClose={onEditPasswordClicked}
            >
                <div class="password-form-modal-content">
                    <div class="old-pass">
                        <h3>Old Password</h3>
                        <input type="text" value="12345678" />
                    </div>
                    <div class="new">
                        <div class="new-pass">
                            <h3>New Password</h3>
                            <input type="password" value="rashasalah" />
                        </div>
                        <div class="co-pass">
                            <h3>Confirm New Password</h3>
                            <input type="password" value="rashasalah" />
                        </div>
                    </div>
                    <button class="change">Change</button>
                    <button class="cancel" onClick={onEditPasswordClicked}>
                        Cancel
                    </button>
                </div>
            </Modal>
            <Modal
                title="Edit My Profile"
                show={showEditModal}
                className="edit-form-modal"
                onClose={onEditClicked}
            >
                <div className="student-name">
                    <h3>Student Name</h3>
                    <input type="text" value="Rasha Salah Alnour" readonly />
                </div>
                <div className="student-id">
                    <h3>Student ID</h3>
                    <input type="text" value="201822000554" readonly />
                </div>
                <div className="email">
                    <h3>Email</h3>
                    <input type="email" value="rashasalah2911@gmail.com" />
                </div>
                <div className="phone">
                    <h3>Phone Number</h3>
                    <input type="text" value="+249 912 345 678" />
                </div>
                <div className="skills">
                    <h3>Skills / Interests</h3>
                    <textarea name="" id="">
                        Web Development, Database Management, Network
                        Fundamentals, Programming Python, Java, UI/UX design
                    </textarea>
                </div>
                <button className="submet">Edit Profile</button>
                <button className="cancel" onClick={onEditClicked}>
                    Cancel
                </button>
            </Modal>
        </>
    );
}
