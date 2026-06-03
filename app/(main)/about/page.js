import React from "react";
import Link from "next/link";
import { getAuthUser } from "@/app/auth";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "About TrainLink",
};

const roleContent = {
    Student: {
        title: "How TrainLink Helps Students",
        description:
            "TrainLink helps students at Sudan University of Science and Technology find approved training and internship opportunities through companies partnered with the university.",
        sections: [
            {
                title: "Your Benefits as a Student",
                items: [
                    "Browse internship opportunities published by contracted companies.",
                    "Apply for opportunities by submitting your resume and cover letter.",
                    "Track your application status through the Applications page.",
                    "View your accepted internships and follow their progress.",
                    "Join forum discussions to ask questions, share knowledge, and learn from others.",
                    "Keep your academic profile updated to support your training journey.",
                ],
            },
            {
                title: "Your Role in the Platform",
                items: [
                    "Submit accurate personal and academic information.",
                    "Apply only for opportunities that match your skills and interests.",
                    "Follow application deadlines carefully.",
                    "Use the forum respectfully for academic and training-related discussions.",
                ],
            },
        ],
        quickLinks: [
            { label: "Interns", href: "/interns" },
            { label: "Applications", href: "/applications" },
            { label: "Forums", href: "/forums" },
        ],
    },

    Company: {
        title: "How TrainLink Helps Companies",
        description:
            "TrainLink helps contracted companies manage internship opportunities and connect with students from Sudan University of Science and Technology through an organized university-supervised process.",
        sections: [
            {
                title: "Your Benefits as a Company",
                items: [
                    "Publish internship opportunities for university students.",
                    "Manage active and inactive internship opportunities.",
                    "Review student applications after university/admin review.",
                    "Accept or reject applications based on company requirements.",
                    "Track accepted internships and mark them as finished when completed.",
                    "Communicate knowledge and support through forum discussions.",
                ],
            },
            {
                title: "Your Role in the Platform",
                items: [
                    "Provide clear and accurate internship details.",
                    "Keep company contact information updated.",
                    "Review applications professionally and fairly.",
                    "Coordinate with the university through the approved training process.",
                ],
            },
        ],
        quickLinks: [
            { label: "Interns", href: "/interns" },
            { label: "Applications", href: "/applications" },
            { label: "Forums", href: "/forums" },
        ],
    },

    Admin: {
        title: "How TrainLink Supports Administration",
        description:
            "TrainLink gives the university administration a central system to manage students, companies, internship applications, and training workflow between Sudan University of Science and Technology and its contracted companies.",
        sections: [
            {
                title: "Administrative Benefits",
                items: [
                    "Manage registered and unregistered students.",
                    "Import and update student records using Excel files.",
                    "Manage contracted companies and their linked accounts.",
                    "Review student applications before companies take action.",
                    "Monitor internship activity across the platform.",
                    "Moderate forum replies when needed.",
                ],
            },
            {
                title: "Administrative Role",
                items: [
                    "Ensure student records are accurate and up to date.",
                    "Support the official university training process.",
                    "Maintain company and student data quality.",
                    "Help keep the platform organized, reliable, and secure.",
                ],
            },
        ],
        quickLinks: [
            { label: "Students", href: "/students" },
            { label: "Companies", href: "/companies" },
            { label: "Applications", href: "/applications" },
            { label: "Forums", href: "/forums" },
        ],
    },

    ERO: {
        title: "How TrainLink Helps ERO Users",
        description:
            "TrainLink supports ERO users by providing access to training-related information, company participation, and communication tools within the university-supervised internship process.",
        sections: [
            {
                title: "ERO Benefits",
                items: [
                    "View available system areas based on assigned permissions.",
                    "Follow training-related discussions through the forum.",
                    "Support communication between students, companies, and administration.",
                    "Help maintain the quality and organization of training information.",
                ],
            },
            {
                title: "ERO Role",
                items: [
                    "Use the platform to support internship coordination.",
                    "Participate in useful forum discussions.",
                    "Keep personal profile information updated.",
                    "Contact the system administrator if additional access is required.",
                ],
            },
        ],
        quickLinks: [{ label: "Forums", href: "/forums" }],
    },

    Guest: {
        title: "TrainLink for University Training Management",
        description:
            "TrainLink is designed to support internship and training management for Sudan University of Science and Technology, its students, and its contracted partner companies.",
        sections: [
            {
                title: "What You Can Do",
                items: [
                    "Learn about the purpose of the platform.",
                    "Access public pages when available.",
                    "Log in to see features based on your account type.",
                ],
            },
        ],
        quickLinks: [
            { label: "Help", href: "/help" },
            { label: "Forums", href: "/forums" },
        ],
    },
};

export default async function AboutPage() {
    const loggedUser = await getAuthUser();
    const role = loggedUser?.role || "Guest";
    const content = roleContent[role] || roleContent.Guest;

    return (
        <div className="content">
            <div className="about-page">
                <h2>About TrainLink</h2>

                <p>
                    TrainLink is a digital internship and training management
                    platform designed for Sudan University of Science and
                    Technology. The platform supports the university in managing
                    student training processes in partnership with contracted
                    companies that provide internship and practical training
                    opportunities.
                </p>

                <section className="about-section">
                    <h3>Platform Purpose</h3>
                    <p>
                        The purpose of TrainLink is to organize the internship
                        lifecycle in one place: from publishing opportunities,
                        applying for training, reviewing applications, managing
                        accepted internships, and supporting communication
                        between students, companies, and university
                        administration.
                    </p>
                </section>

                <section className="about-section">
                    <h3>University Role</h3>
                    <p>
                        Sudan University of Science and Technology is the
                        administrative authority responsible for managing the
                        training process through the platform. The university
                        supervises student data, company participation,
                        application review, and the overall training workflow in
                        coordination with contracted companies.
                    </p>
                </section>

                <section className="about-section">
                    <h3>{content.title}</h3>
                    <p>{content.description}</p>
                </section>

                <section className="about-section">
                    <h3>Quick Links</h3>
                    <div
                        className="buttons"
                        style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginTop: "10px",
                        }}
                    >
                        {content.quickLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="button"
                                style={{ textDecoration: "none" }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </section>

                {content.sections.map((section) => (
                    <section className="about-section" key={section.title}>
                        <h3>{section.title}</h3>
                        <ul>
                            {section.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </section>
                ))}

                <section className="about-section">
                    <h3>Our Mission</h3>
                    <p>
                        Our mission is to bridge the gap between academic
                        learning and real-world experience by providing a
                        reliable, transparent, and university-supervised
                        internship management system.
                    </p>
                </section>

                <section className="about-section">
                    <h3>Our Vision</h3>
                    <p>
                        TrainLink aims to become a trusted digital platform that
                        improves training coordination, supports student career
                        development, and strengthens collaboration between the
                        university and industry partners.
                    </p>
                </section>
            </div>
        </div>
    );
}
