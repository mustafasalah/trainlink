import Image from "next/image";
import JobCard from "../components/JobCard";
import { getAuthToken, getAuthUser } from "../auth";
import MyInternsSection from "../components/MyInternsSection";
import CompaniesView from "../components/CompaniesView";

export const dynamic = "force-dynamic";

export default async function Home() {
    const loggedUser = await getAuthUser();

    if (!loggedUser) return null;

    if (loggedUser.role === "ERO") {
        const data = await fetch("http://localhost:3000/api/companies");
        const companies = await data.json();
        return (
            <div className="content">
                <CompaniesView companies={companies} />
            </div>
        );
    }

    const data = await fetch("http://localhost:3000/api/jobs", {
        headers: {
            "auth-token": await getAuthToken(),
        },
        next: { tags: ["jobs"] },
    });
    const jobs = (await data.json()).reverse();

    if (loggedUser.role === "Company") {
        return (
            <div className="content">
                <div className="interns">
                    <MyInternsSection
                        internships={jobs}
                        tabs={["active", "inactive"]}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="content">
            <div className="available">
                {loggedUser.role === "Student" ? (
                    <>
                        <h3>Newest Opportunities</h3>
                        <div className="cards">
                            {jobs.slice(0, 3).map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                            {jobs.length === 0
                                ? "There are no Job Opportunities"
                                : ""}
                        </div>
                    </>
                ) : (
                    <>
                        <h3>Available Opportunities</h3>
                        <div className="cards">
                            {jobs.map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                            {jobs.length === 0
                                ? "There are no Job Opportunities"
                                : ""}
                        </div>
                    </>
                )}
            </div>
            {loggedUser.role === "Student" ? (
                <div className="recommend">
                    {jobs.slice(3).length === 0 ? (
                        ""
                    ) : (
                        <>
                            <h3>Recommended for you</h3>
                            <div className="cards">
                                {jobs.slice(3).map((job) => (
                                    <JobCard key={job._id} job={job} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                ""
            )}
        </div>
    );
}
