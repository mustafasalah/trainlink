import Image from "next/image";
import JobCard from "../components/JobCard";
import { getAuthToken, getAuthUser } from "../auth";
import MyInternsSection from "../components/MyInternsSection";
import CompaniesView from "../components/CompaniesView";

export const dynamic = "force-dynamic";

export default async function Home() {
    const loggedUser = await getAuthUser();

    if (loggedUser.role === "ERO") {
        const data = await fetch("http://localhost:3000/api/companies");
        const companies = await data.json();
        return (
            <div className="content">
                <CompaniesView companies={companies} />
            </div>
        );
    }

    if (loggedUser.role === "Company") {
        const data = await fetch("http://localhost:3000/api/jobs", {
            headers: {
                "auth-token": await getAuthToken(),
            },
            next: { tags: ["jobs"] },
        });
        const companyJobs = await data.json();
        return (
            <div className="content">
                <div className="interns">
                    <MyInternsSection
                        internships={companyJobs}
                        tabs={["active", "inactive"]}
                    />
                </div>
            </div>
        );
    }

    const data = await fetch("http://localhost:3000/api/jobs", {
        next: { tags: ["jobs"] },
    });
    const jobs = await data.json();

    return (
        <div className="content">
            {loggedUser.role === "Student" ? (
                <div className="progress-card">
                    <div className="progress-info">
                        <span className="your-progress">
                            <i className="icon-trending-up"></i>your progress
                        </span>
                        <div className="progress-line">
                            <div className="progress">
                                <span></span>
                            </div>
                            <span>
                                50% complete
                                <p>
                                    <i className="icon-dot"></i>4 weeks left
                                </p>
                            </span>
                        </div>
                        <h2>UI / UX Designer</h2>
                    </div>
                    <div className="progress-img">
                        <Image
                            src="/img/Group 2.svg"
                            alt=""
                            width={280}
                            height={120}
                        />
                    </div>
                </div>
            ) : (
                ""
            )}
            <div className="available">
                {loggedUser.role === "Student" ? (
                    <>
                        <h3>Newest Opportunities</h3>
                        <div className="cards">
                            {jobs.slice(0, 3).map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <h3>Available Opportunities</h3>
                        <div className="cards">
                            {jobs.map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                        </div>
                    </>
                )}
            </div>
            {loggedUser.role === "Student" ? (
                <div className="recommend">
                    <h3>Recommended for you</h3>
                    <div className="cards">
                        {jobs.slice(3).map((job) => (
                            <JobCard key={job._id} job={job} />
                        ))}
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}
