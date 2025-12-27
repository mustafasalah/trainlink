import React from "react";

export const metadata = {
    title: "About TrainLink",
};

export default function AboutPage() {
    return (
        <div className="content">
            <div className="about-page">
                <h2>About TrainLink</h2>

                <p>
                    TrainLink is a digital platform designed to connect
                    students, companies, and educational institutions through
                    internship and training opportunities.
                </p>

                <section className="about-section">
                    <h3>Our Mission</h3>
                    <p>
                        Our mission is to bridge the gap between academic
                        learning and real-world experience by providing a
                        reliable and transparent internship management system.
                    </p>
                </section>

                <section className="about-section">
                    <h3>What TrainLink Offers</h3>
                    <ul>
                        <li>Internship and job opportunity management.</li>
                        <li>Easy application and tracking for students.</li>
                        <li>
                            Company tools to manage interns and applications.
                        </li>
                        <li>Forum for knowledge sharing and discussions.</li>
                        <li>Secure role-based access for all users.</li>
                    </ul>
                </section>

                <section className="about-section">
                    <h3>Who Can Use TrainLink</h3>
                    <ul>
                        <li>Students looking for internships and training.</li>
                        <li>Companies offering internship opportunities.</li>
                        <li>Educational institutions and administrators.</li>
                        <li>System administrators and ERO users.</li>
                    </ul>
                </section>

                <section className="about-section">
                    <h3>Why TrainLink?</h3>
                    <p>
                        TrainLink simplifies the internship lifecycle—from
                        posting opportunities to managing applications and
                        feedback—ensuring a smooth experience for everyone
                        involved.
                    </p>
                </section>

                <section className="about-section">
                    <h3>Our Vision</h3>
                    <p>
                        We aim to become a trusted platform that supports career
                        development, skills growth, and collaboration between
                        students and industry.
                    </p>
                </section>
            </div>
        </div>
    );
}
