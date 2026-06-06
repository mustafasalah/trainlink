"use client";

import Link from "next/link";
import React, { useCallback, useState } from "react";
import Card from "./Card";
import { useRouter } from "next/navigation";
import useLoggedUser from "../hooks/useLoggedUser";
import Modal from "./Modal";
import {
    createCompanyAndOwner,
    deleteCompanyAndOwner,
} from "../services/CompanyService";
import { summarize } from "../functions";

export default function CompaniesView({ companies }) {
    const loggedUser = useLoggedUser();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const router = useRouter();

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const handleOpenEdit = useCallback((company) => {
        setSelectedCompany(company);
        setShowEditModal(true);
    }, []);

    const handleCloseEdit = useCallback(() => {
        setSelectedCompany(null);
        setShowEditModal(false);
    }, []);

    const handleUpdate = useCallback(
        async (event) => {
            event.preventDefault();

            if (!selectedCompany?._id) return;

            const form = event.currentTarget;
            const formData = new FormData(form);

            const payload = {
                name: formData.get("name"),
                email: formData.get("email"),
                phoneNumber: formData.get("phoneNumber"),
                website: formData.get("website"),
                industry: formData.get("industry"),
                about: formData.get("about"),
                agreement: {
                    date: formData.get("agreement.date"),
                    period: formData.get("agreement.period"),
                    renewal_type: formData.get("agreement.renewal_type"),
                    nature: formData.get("agreement.nature"),
                },
            };

            try {
                const res = await fetch(
                    `/api/companies/${selectedCompany._id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    },
                );

                const data = await res.json().catch(() => ({}));

                if (!res.ok) {
                    alert(data?.error || "Failed to update company.");
                    return;
                }

                alert("Company updated successfully.");
                handleCloseEdit();
                router.refresh();
            } catch (err) {
                console.error(err);
                alert("Something went wrong while updating company.");
            }
        },
        [selectedCompany, handleCloseEdit, router],
    );

    const handleCloseModal = useCallback(() => {
        setShowCreateModal(false);
    });

    const handleOpenModal = useCallback(() => {
        setShowCreateModal(true);
    });

    const handleDelete = useCallback(async (id, name) => {
        const yesDelete = confirm("Are you sure to delete (" + name + ") ?");
        if (yesDelete) {
            await deleteCompanyAndOwner(id);
            router.refresh();
            alert(name + " has been deleted successfully.");
        }
    }, []);

    const handleCreate = useCallback(async (formData) => {
        try {
            const companyData = {
                name: formData.get("name"),
                email: formData.get("email"),
                phoneNumber: formData.get("phonenumber"),
                industry: formData.get("industry"),
                about: formData.get("about"),
                website: formData.get("website"),
                agreement: {
                    date: formData.get("agreement.date"),
                    period: formData.get("agreement.period"),
                    renewal_type: formData.get("agreement.renewal_type"),
                    nature: formData.get("agreement.nature"),
                },
            };

            const userData = {
                fullName: formData.get("contact_person"),
                email: formData.get("email"),
                username: formData.get("username"),
                password: formData.get("password"),
            };

            if (!formData.has("photo")) {
                return alert("You must upload company photo first!");
            }

            // API Call
            await createCompanyAndOwner(
                companyData,
                userData,
                formData.get("photo"),
            );
        } catch (err) {
            console.log(err);
        }

        alert("The Company has been added successfully.");
        handleCloseModal();
        router.refresh();
    }, []);

    return (
        <div className="companies">
            <h3>
                <div>
                    {loggedUser.role === "ERO" ? "Contracted" : ""} Companies
                    <span className="count">({companies.length})</span>
                </div>
                <div className="buttons">
                    {loggedUser.role === "ERO" ? (
                        <Link href="/companies/report" target="_blank">
                            <button
                                style={{
                                    backgroundColor: "red",
                                    marginRight: 8,
                                }}
                                type="button"
                            >
                                Export Agreements Report
                            </button>
                        </Link>
                    ) : (
                        ""
                    )}

                    {loggedUser.role === "ERO" ? (
                        <button onClick={handleOpenModal}>
                            Add New Company
                        </button>
                    ) : (
                        ""
                    )}
                </div>
            </h3>
            <div className="companies-cards">
                {companies
                    .map((company) => {
                        const { _id, thumbnailUrl, name, about } = company;

                        return (
                            <div style={{ position: "relative" }}>
                                <Card
                                    key={_id}
                                    url={`/companies/${_id}`}
                                    thumbnailUrl={thumbnailUrl}
                                    title={name}
                                    description={summarize(about)}
                                    editable={loggedUser.role === "ERO"}
                                    onDelete={handleDelete.bind(
                                        null,
                                        _id,
                                        name,
                                    )}
                                />
                                {loggedUser.role === "ERO" ? (
                                    <button
                                        type="button"
                                        onClick={() => handleOpenEdit(company)}
                                        style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "10px",
                                            background: "#2563eb",
                                            color: "#fff",
                                            border: "none",
                                            padding: "6px 10px",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontSize: "12px",
                                        }}
                                    >
                                        Edit
                                    </button>
                                ) : (
                                    ""
                                )}
                            </div>
                        );
                    })
                    .reverse()}
            </div>
            <form action={handleCreate}>
                <Modal
                    title="Add New Company"
                    show={showCreateModal}
                    className="app-modal"
                    onClose={handleCloseModal}
                >
                    <div className="box">
                        <label>
                            <i className="icon-building-2"></i>Company Name
                        </label>
                        <input type="text" name="name" />
                    </div>
                    <div className="box">
                        <label>
                            <i className="icon-image"></i>Company Profile Photo
                        </label>
                        <input
                            type="file"
                            name="photo"
                            accept=".jpeg,.jpg,.png,.webp"
                            required
                        />
                    </div>
                    <div className="box">
                        <label>
                            <i className="icon-mail"></i>Email Address
                        </label>
                        <input type="email" name="email" />
                    </div>
                    <div className="box">
                        <label>
                            <i className="icon-phone"></i>Phone Number
                        </label>
                        <span className="key-num">+249</span>
                        <input
                            className="phone"
                            name="phonenumber"
                            type="text"
                        />
                    </div>
                    <div className="box">
                        <label>
                            <i className="icon-globe"></i>Website
                        </label>
                        <input type="text" name="website" />
                    </div>
                    <div className="box">
                        <label>
                            <i className="icon-briefcase-business"></i>
                            Industry
                        </label>
                        <div>
                            <select name="industry" id="industry" required>
                                <option value="">-- Select Industry --</option>
                                <option value="technology">Technology</option>
                                <option value="finance">
                                    Finance & Banking
                                </option>
                                <option value="healthcare">Healthcare</option>
                                <option value="education">Education</option>
                                <option value="manufacturing">
                                    Manufacturing
                                </option>
                                <option value="retail">
                                    Retail & E-commerce
                                </option>
                                <option value="real_estate">
                                    Real Estate & Construction
                                </option>
                                <option value="transportation">
                                    Transportation & Logistics
                                </option>
                                <option value="energy">
                                    Energy & Utilities
                                </option>
                                <option value="agriculture">
                                    Agriculture & Farming
                                </option>
                                <option value="food_beverage">
                                    Food & Beverage
                                </option>
                                <option value="hospitality">
                                    Hospitality & Tourism
                                </option>
                                <option value="media">
                                    Media & Entertainment
                                </option>
                                <option value="telecom">
                                    Telecommunications
                                </option>
                                <option value="consulting">
                                    Consulting & Professional Services
                                </option>
                                <option value="legal">Legal Services</option>
                                <option value="government">
                                    Government & Public Sector
                                </option>
                                <option value="nonprofit">
                                    Non-Profit & NGOs
                                </option>
                                <option value="aerospace">
                                    Aerospace & Defense
                                </option>
                                <option value="pharmaceuticals">
                                    Pharmaceuticals & Biotechnology
                                </option>
                            </select>

                            <i className="icon-chevron-down"></i>
                        </div>
                    </div>
                    <div className="box full-width">
                        <label>
                            <i className="icon-file-text"></i>Company
                            Description
                        </label>
                        <textarea
                            name="about"
                            placeholder="Write description here ..."
                        ></textarea>
                    </div>

                    <h3 className="full-width box">Supervisor Account</h3>
                    <div className="box full-width">
                        <label>
                            <i className="icon-circle-user-round"></i>
                            Full Name
                        </label>
                        <input type="text" name="contact_person" />
                    </div>
                    <div className="box">
                        <label>
                            <i className="icon-at-sign"></i>Account Username
                        </label>
                        <input type="text" name="username" />
                    </div>
                    <div className="box">
                        <label>
                            <i className="icon-lock"></i>Account Password
                        </label>
                        <input name="password" type="password" />
                    </div>

                    <h3 className="full-width box">Agreement Details</h3>
                    <div className="box">
                        <label htmlFor="agreement-date">Date</label>
                        <input
                            type="date"
                            id="agreement-date"
                            name="agreement.date"
                            required
                        />
                    </div>
                    <div className="box">
                        <label htmlFor="agreement-period">Period</label>
                        <input
                            type="text"
                            id="agreement-period"
                            name="agreement.period"
                            placeholder="e.g., 1 year, 6 months"
                            required
                        />
                    </div>
                    <div className="box">
                        <label htmlFor="agreement-renewal-type">
                            Renewal Type
                        </label>
                        <select
                            id="agreement-renewal-type"
                            name="agreement.renewal_type"
                            required
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select renewal type
                            </option>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                        </select>
                    </div>

                    <div className="box">
                        <label htmlFor="agreement-nature">Nature</label>
                        <select
                            id="agreement-nature"
                            name="agreement.nature"
                            required
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select nature
                            </option>
                            <option value="Exclusive">Exclusive</option>
                            <option value="Non-exclusive">Non-exclusive</option>
                        </select>
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

            {loggedUser.role === "ERO" && selectedCompany ? (
                <form onSubmit={handleUpdate}>
                    <Modal
                        title="Edit Company"
                        show={showEditModal}
                        className="app-modal"
                        onClose={handleCloseEdit}
                    >
                        <div className="box">
                            <label>
                                <i className="icon-building-2"></i>Company Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={selectedCompany.name || ""}
                                required
                            />
                        </div>

                        <div className="box">
                            <label>
                                <i className="icon-mail"></i>Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                defaultValue={selectedCompany.email || ""}
                            />
                        </div>

                        <div className="box">
                            <label>
                                <i className="icon-phone"></i>Phone Number
                            </label>
                            <input
                                type="text"
                                name="phoneNumber"
                                defaultValue={selectedCompany.phoneNumber || ""}
                            />
                        </div>

                        <div className="box">
                            <label>
                                <i className="icon-globe"></i>Website
                            </label>
                            <input
                                type="text"
                                name="website"
                                defaultValue={selectedCompany.website || ""}
                            />
                        </div>

                        <div className="box">
                            <label>
                                <i className="icon-briefcase-business"></i>
                                Industry
                            </label>
                            <input
                                type="text"
                                name="industry"
                                defaultValue={selectedCompany.industry || ""}
                            />
                        </div>

                        <div className="box full-width">
                            <label>
                                <i className="icon-file-text"></i>Company
                                Description
                            </label>
                            <textarea
                                name="about"
                                defaultValue={selectedCompany.about || ""}
                            />
                        </div>

                        <h3 className="full-width box">Agreement Details</h3>

                        <div className="box">
                            <label htmlFor="edit-agreement-date">Date</label>
                            <input
                                type="date"
                                id="edit-agreement-date"
                                name="agreement.date"
                                defaultValue={
                                    selectedCompany.agreement?.date
                                        ? new Date(
                                              selectedCompany.agreement.date,
                                          )
                                              .toISOString()
                                              .slice(0, 10)
                                        : ""
                                }
                                required
                            />
                        </div>

                        <div className="box">
                            <label htmlFor="edit-agreement-period">
                                Period
                            </label>
                            <input
                                type="text"
                                id="edit-agreement-period"
                                name="agreement.period"
                                defaultValue={
                                    selectedCompany.agreement?.period || ""
                                }
                                required
                            />
                        </div>

                        <div className="box">
                            <label htmlFor="edit-agreement-renewal-type">
                                Renewal Type
                            </label>
                            <input
                                type="text"
                                id="edit-agreement-renewal-type"
                                name="agreement.renewal_type"
                                defaultValue={
                                    selectedCompany.agreement?.renewal_type ||
                                    ""
                                }
                                required
                            />
                        </div>

                        <div className="box">
                            <label htmlFor="edit-agreement-nature">
                                Nature
                            </label>
                            <input
                                type="text"
                                id="edit-agreement-nature"
                                name="agreement.nature"
                                defaultValue={
                                    selectedCompany.agreement?.nature || ""
                                }
                                required
                            />
                        </div>

                        <button
                            className="cancel"
                            type="button"
                            onClick={handleCloseEdit}
                        >
                            Cancel
                        </button>

                        <button className="app-ero-submit" type="submit">
                            Update
                        </button>
                    </Modal>
                </form>
            ) : (
                ""
            )}
        </div>
    );
}
