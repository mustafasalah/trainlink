import Image from "next/image";
import JobCard from "./components/JobCard";

export default async function Home() {
    const data = await fetch("http://localhost:3000/api/jobs");
    const jobs = await data.json();

    return (
        <div className="content">
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
            <div className="available">
                <h3>Available Opportunities</h3>
                <div className="cards">
                    {jobs.map((job) => (
                        <JobCard key={job.id} intern={job} />
                    ))}
                </div>
            </div>
            <div className="recommend">
                <h3>Recommended for you</h3>
                <div className="cards"></div>
            </div>
        </div>
    );
}
