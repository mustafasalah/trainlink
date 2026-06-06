"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import Link from "next/link";
import { getAuthToken } from "../auth";

export default function EROTable({ eros = [] }) {
    const router = useRouter();

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedERO, setSelectedERO] = useState(null);

    const openEdit = useCallback((ero) => {
        setSelectedERO(ero);
        setShowEditModal(true);
    }, []);

    const closeEdit = useCallback(() => {
        setSelectedERO(null);
        setShowEditModal(false);
    }, []);

    const handleUpdate = useCallback(
        async (event) => {
            event.preventDefault();

            if (!selectedERO?._id) return;

            const form = event.currentTarget;
            const formData = new FormData(form);

            const payload = {
                fullName: formData.get("fullName"),
                email: formData.get("email"),
                username: formData.get("username"),
                phoneNumber: formData.get("phoneNumber"),
                password: formData.get("password"),
            };

            try {
                const res = await fetch(`/api/eros/${selectedERO._id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": await getAuthToken(),
                    },
                    body: JSON.stringify(payload),
                });

                const data = await res.json().catch(() => ({}));

                if (!res.ok) {
                    alert(data?.error || "Failed to update ERO account.");
                    return;
                }

                alert("ERO account updated successfully.");
                closeEdit();
                router.refresh();
            } catch (err) {
                console.error(err);
                alert("Something went wrong while updating ERO account.");
            }
        },
        [selectedERO, closeEdit, router],
    );

    const handleDelete = useCallback(
        async (ero) => {
            const yes = confirm(
                `Are you sure you want to delete ERO account "${ero.fullName}"?`,
            );

            if (!yes) return;

            try {
                const res = await fetch(`/api/eros/${ero._id}`, {
                    method: "DELETE",
                    headers: {
                        "auth-token": await getAuthToken(),
                    },
                });

                const data = await res.json().catch(() => ({}));

                if (!res.ok) {
                    alert(data?.error || "Failed to delete ERO account.");
                    return;
                }

                alert("ERO account deleted successfully.");
                router.refresh();
            } catch (err) {
                console.error(err);
                alert("Something went wrong while deleting ERO account.");
            }
        },
        [router],
    );

    return (
        <div className="apps-form">
            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Email</td>
                        <td>Username</td>
                        <td>Phone</td>
                        <td>Created At</td>
                        <td>Action</td>
                    </tr>
                </thead>

                <tbody>
                    {eros.length === 0 ? (
                        <tr>
                            <td colSpan="6">No ERO accounts found.</td>
                        </tr>
                    ) : (
                        eros.map((ero) => (
                            <tr key={ero._id}>
                                <td>
                                    <Link href={`/users/${ero._id}`}>
                                        {ero.fullName}
                                    </Link>
                                </td>
                                <td>{ero.email || "-"}</td>
                                <td>{ero.username || "-"}</td>
                                <td>{ero.phoneNumber || "-"}</td>
                                <td>
                                    {ero.createdAt
                                        ? new Date(ero.createdAt)
                                              .toISOString()
                                              .slice(0, 10)
                                        : "-"}
                                </td>
                                <td>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "8px",
                                            alignItems: "center",
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => openEdit(ero)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(ero)}
                                            style={{
                                                background: "#dc2626",
                                                color: "#fff",
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* EDIT MODAL */}
            {selectedERO ? (
                <form onSubmit={handleUpdate}>
                    <Modal
                        title="Edit ERO Account"
                        show={showEditModal}
                        className="app-modal"
                        onClose={closeEdit}
                    >
                        <EROFormFields mode="edit" ero={selectedERO} />

                        <button
                            className="cancel"
                            type="button"
                            onClick={closeEdit}
                        >
                            Cancel
                        </button>
                        <button className="app-ero-submit" type="submit">
                            Update
                        </button>
                    </Modal>
                </form>
            ) : null}
        </div>
    );
}

function EROFormFields({ mode, ero = null }) {
    return (
        <>
            <div className="box">
                <label>
                    <i className="icon-circle-user-round"></i>Full Name
                </label>
                <input
                    type="text"
                    name="fullName"
                    defaultValue={ero?.fullName || ""}
                    required
                />
            </div>

            <div className="box">
                <label>
                    <i className="icon-mail"></i>Email
                </label>
                <input
                    type="email"
                    name="email"
                    defaultValue={ero?.email || ""}
                    required
                />
            </div>

            <div className="box">
                <label>
                    <i className="icon-at-sign"></i>Username
                </label>
                <input
                    type="text"
                    name="username"
                    defaultValue={ero?.username || ""}
                    required
                />
            </div>

            <div className="box">
                <label>
                    <i className="icon-phone"></i>Phone Number
                </label>
                <input
                    type="text"
                    name="phoneNumber"
                    defaultValue={ero?.phoneNumber || ""}
                />
            </div>

            <div className="box full-width">
                <label>
                    <i className="icon-lock"></i>
                    {mode === "create"
                        ? "Password"
                        : "New Password (leave empty to keep current password)"}
                </label>
                <input
                    type="password"
                    name="password"
                    required={mode === "create"}
                    minLength={mode === "create" ? 6 : undefined}
                />
            </div>

            {mode === "create" ? (
                <div className="box full-width">
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
            ) : (
                ""
            )}
        </>
    );
}
