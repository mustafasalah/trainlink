import React from "react";
import ApplicationsTable from "@/app/components/ApplicationsTable";
import { getAuthToken, getAuthUser } from "@/app/auth";
import ApplicationsFilters from "@/app/components/ApplicationsFilter";

export const dynamic = "force-dynamic";

export default async function Applications({ searchParams }) {
    const loggedUser = await getAuthUser();
    const q = ((await searchParams)?.q || "").trim();

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
                    My Applications{" "}
                    <span>
                        (
                        {
                            applications.filter((application) => {
                                if (loggedUser.role === "Company")
                                    return application.acceptedByAdmin;
                                return true;
                            }).length
                        }
                        )
                    </span>
                </h3>

                <ApplicationsFilters />

                <ApplicationsTable applications={applications} />
            </div>
        </div>
    );
}
