import React from "react";
import { redirect } from "next/navigation";
import { getAuthToken, getAuthUser } from "@/app/auth";
import EROFilters from "@/app/components/EROFilters";
import EROTable from "@/app/components/EROTable";
import EROCreateButton from "@/app/components/EROCreateButton";

export const dynamic = "force-dynamic";

export default async function EROAccountsPage({ searchParams }) {
    const loggedUser = await getAuthUser();

    if (!loggedUser || loggedUser.role !== "Admin") {
        redirect("/");
    }

    const params = await searchParams;
    const q = (params?.q || "").trim();

    const qs = new URLSearchParams();
    if (q) qs.set("q", q);

    const data = await fetch(
        `http://localhost:3000/api/eros?${qs.toString()}`,
        {
            headers: {
                "auth-token": await getAuthToken(),
            },
            cache: "no-store",
        },
    );

    const eros = await data.json();

    return (
        <div className="content">
            <div className="applications eros">
                <div
                    className="head-title"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <h3>
                        ERO Accounts <span>({eros.length})</span>
                    </h3>

                    <div className="buttons">
                        <EROCreateButton />
                    </div>
                </div>

                <EROFilters />

                <EROTable eros={eros} />
            </div>
        </div>
    );
}
