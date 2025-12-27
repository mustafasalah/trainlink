import React from "react";
import CompanyProfile from "@/app/components/CompanyProfile";
import { getAuthToken } from "@/app/auth";

export const dynamic = "force-dynamic";

export default async function CompanyDetials({ params }) {
    const companyId = (await params).id;
    const companyData = await fetch(
        `http://localhost:3000/api/companies/${companyId}`
    );
    const company = await companyData.json();
    const JobData = await fetch(
        `http://localhost:3000/api/jobs?companyId=${companyId}`,
        {
            headers: {
                "auth-token": await getAuthToken(),
            },
            next: { tags: ["jobs"] },
        }
    );
    const jobs = await JobData.json();

    return <CompanyProfile company={company} jobs={jobs} />;
}
