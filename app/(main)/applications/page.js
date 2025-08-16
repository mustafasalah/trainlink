import React from "react";
import ApplicationRow from "../../components/ApplicationRow";
import { getAuthToken, getAuthUser } from "@/app/auth";
import Modal from "@/app/components/Modal";
import ApplicationsTable from "@/app/components/ApplicationsTable";

export const dynamic = "force-dynamic";

export default async function Applications() {
    const data = await fetch("http://localhost:3000/api/applications", {
        headers: {
            "auth-token": await getAuthToken(),
        },
    });
    const applications = await data.json();

    return (
        <>
            <div className="content">
                <div className="applications">
                    <h3>
                        My Applications<span>({applications.length})</span>
                    </h3>
                    <div className="apps-search-form">
                        <div className="app-search-status">
                            <div className="search-box">
                                <input
                                    type="search"
                                    name=""
                                    id=""
                                    placeholder="Search by opportunity name"
                                />
                            </div>
                            <div className="status">
                                <p>Status:</p>
                                <form action="select">
                                    <select name="status" defaultValue="All">
                                        <option value="All">All</option>
                                        <option value="Approved">
                                            Approved
                                        </option>
                                        <option value="Pending">Pending</option>
                                        <option value="Rejected">
                                            Rejected
                                        </option>
                                    </select>
                                    <i className="icon-chevron-down"></i>
                                </form>
                            </div>
                        </div>
                        <div className="items">
                            <p>Items Per Page</p>
                            <form action="select">
                                <select name="items" defaultValue="10">
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                {/* <i className="icon-chevron-down"></i> */}
                            </form>
                        </div>
                    </div>
                    <ApplicationsTable applications={applications} />
                </div>
            </div>
        </>
    );
}
