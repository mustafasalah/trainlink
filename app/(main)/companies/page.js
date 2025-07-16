import React from "react";
import CompaniesView from "@/app/components/CompaniesView";

export const dynamic = "force-dynamic";

export default async function Companies() {
    const data = await fetch("http://localhost:3000/api/companies");
    const companies = await data.json();

    return (
        <div className="content">
            <CompaniesView companies={companies} />
        </div>
    );
}
