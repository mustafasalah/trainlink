"use client";

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
                formData.get("photo")
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
                    <button onClick={handleOpenModal}>Add New Company</button>
                </div>
            </h3>
            <div className="companies-cards">
                {companies
                    .map(({ _id, thumbnailUrl, name, about }) => (
                        <Card
                            key={_id}
                            url={`/companies/${_id}`}
                            thumbnailUrl={thumbnailUrl}
                            title={name}
                            description={summarize(about)}
                            editable={loggedUser.role === "ERO"}
                            onDelete={handleDelete.bind(null, _id, name)}
                        />
                    ))
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
                            accept=".jpeg,.jpg,.png"
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
                        <input
                            type="text"
                            id="agreement-renewal-type"
                            name="agreement.renewal_type"
                            placeholder="e.g., Automatic, Manual"
                            required
                        />
                    </div>
                    <div className="box">
                        <label htmlFor="agreement-nature">Nature</label>
                        <input
                            type="text"
                            id="agreement-nature"
                            name="agreement.nature"
                            placeholder="e.g., Exclusive, Non-exclusive"
                            required
                        />
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
        </div>
    );
}
