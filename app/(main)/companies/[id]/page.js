import Image from "next/image";
import React from "react";
import JobCard from "../../../components/JobCard";
import BackButton from "@/app/components/BackButton";
import CompanyProfile from "@/app/components/CompanyProfile";

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
            next: { tags: ["jobs"] },
        }
    );
    const jobs = await JobData.json();

    return <CompanyProfile company={company} jobs={jobs} />;
}
