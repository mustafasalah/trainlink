"use client";

import React, { useCallback, useState } from "react";
import Card from "./Card";
import { useRouter } from "next/navigation";
import useLoggedUser from "../hooks/useLoggedUser";
import Modal from "./Modal";

export default function CompaniesView({ companies }) {
    const loggedUser = useLoggedUser();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const router = useRouter();

    const handleCloseModal = useCallback(() => {
        setShowCreateModal(false);
    });

    const handleOpenModal = useCallback(() => {
        setShowCreateModal(true);
    });

    const handleCreate = useCallback(async () => {
        try {
            // API Call Here

            alert("The Company has been added successfully.");
            handleCloseModal();
            router.refresh();
        } catch (err) {
            alert(err);
        }
    }, [router]);

    return (
        <div className="companies">
            <h3>
                <div>
                    {loggedUser.role === "ERO" ? "Contracted" : ""} Companies
                    <span className="count">({companies.length})</span>
                </div>
                <div className="buttons">
                    <button onClick={handleOpenModal}>Add New Company</button>
                </div>
            </h3>
            <div className="companies-cards">
                {companies.map(({ _id, thumbnailUrl, name, description }) => (
                    <Card
                        key={_id}
                        url={`/companies/${_id}`}
                        thumbnailUrl={thumbnailUrl}
                        title={name}
                        description={description}
                        editable={loggedUser.role === "ERO"}
                    />
                ))}
            </div>
            <Modal
                title="Add New Company"
                show={showCreateModal}
                className="app-modal"
                onClose={handleCloseModal}
            >
                <>
                    <button className="submet" onClick={handleCreate}>
                        Create
                    </button>

                    <button className="cancel" onClick={handleCloseModal}>
                        Cancel
                    </button>
                </>
            </Modal>
        </div>
    );
}
