import React from "react";
import ApplicationsTable from "@/app/components/ApplicationsTable";
import { getAuthToken } from "@/app/auth";
import ApplicationsFilters from "@/app/components/ApplicationsFilter";

export const dynamic = "force-dynamic";

export default async function Applications({ searchParams }) {
    const q = (searchParams?.q || "").trim();

    const qs = new URLSearchParams();
    if (q) qs.set("q", q);

    const data = await fetch(
        `http://localhost:3000/api/applications?${qs.toString()}`,
        {
            headers: {
                "auth-token": await getAuthToken(),
            },
            cache: "no-store",
        }
    );

    const applications = await data.json();

    return (
        <div className="content">
            <div className="applications">
                <h3>
                    My Applications <span>({applications.length})</span>
                </h3>

                <ApplicationsFilters />

                <ApplicationsTable applications={applications} />
            </div>
        </div>
    );
}
