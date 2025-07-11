import React from "react";
import CompaniesView from "@/app/components/CompaniesView";

export const dynamic = "force-dynamic";

export default async function Companies() {
    const data = await fetch("https://trainlink.fly.dev/api/companies");
    const companies = await data.json();

    return (
        <div className="content">
            <CompaniesView companies={companies} />
        </div>
    );
}
