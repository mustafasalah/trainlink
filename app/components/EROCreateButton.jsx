"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { getAuthToken } from "../auth";

export default function EROCreateButton() {
    const router = useRouter();

    const [showCreateModal, setShowCreateModal] = useState(false);

    const openCreate = useCallback(() => {
        setShowCreateModal(true);
    }, []);

    const closeCreate = useCallback(() => {
        setShowCreateModal(false);
    }, []);

    const handleCreate = useCallback(
        async (event) => {
            event.preventDefault();

            const form = event.currentTarget;
            const formData = new FormData(form);

            const payload = {
                fullName: formData.get("fullName"),
                email: formData.get("email"),
                username: formData.get("username"),
                phoneNumber: formData.get("phoneNumber"),
                password: formData.get("password"),
                confirmPassword: formData.get("confirmPassword"),
            };

            try {
                const res = await fetch("/api/eros", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": await getAuthToken(),
                    },
                    body: JSON.stringify(payload),
                });

                const data = await res.json().catch(() => ({}));

                if (!res.ok) {
                    alert(data?.error || "Failed to create ERO account.");
                    return;
                }

                alert("ERO account created successfully.");
                form.reset();
                closeCreate();
                router.refresh();
            } catch (err) {
                console.error(err);
                alert("Something went wrong while creating ERO account.");
            }
        },
        [closeCreate, router],
    );

    return (
        <>
            <button type="button" onClick={openCreate}>
                Add New ERO
            </button>

            <form onSubmit={handleCreate}>
                <Modal
                    title="Add New ERO"
                    show={showCreateModal}
                    className="app-modal"
                    onClose={closeCreate}
                >
                    <EROCreateFormFields />

                    <button
                        className="cancel"
                        type="button"
                        onClick={closeCreate}
                    >
                        Cancel
                    </button>

                    <button className="app-ero-submit" type="submit">
                        Create
                    </button>
                </Modal>
            </form>
        </>
    );
}

function EROCreateFormFields() {
    return (
        <>
            <div className="box">
                <label>
                    <i className="icon-circle-user-round"></i>Full Name
                </label>
                <input type="text" name="fullName" required />
            </div>

            <div className="box">
                <label>
                    <i className="icon-mail"></i>Email
                </label>
                <input type="email" name="email" required />
            </div>

            <div className="box">
                <label>
                    <i className="icon-at-sign"></i>Username
                </label>
                <input type="text" name="username" required />
            </div>

            <div className="box">
                <label>
                    <i className="icon-phone"></i>Phone Number
                </label>
                <input type="text" name="phoneNumber" />
            </div>

            <div className="box">
                <label>
                    <i className="icon-lock"></i>Password
                </label>
                <input type="password" name="password" required minLength={6} />
            </div>

            <div className="box">
                <label>
                    <i className="icon-lock-keyhole"></i>Confirm Password
                </label>
                <input
                    type="password"
                    name="confirmPassword"
                    required
                    minLength={6}
                />
            </div>
        </>
    );
}
