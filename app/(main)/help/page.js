import React from "react";
import Link from "next/link";
import { getAuthUser } from "@/app/auth";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Help & Support",
};

const helpContent = {
    Student: {
        title: "Student Help Guide",
        intro: "This guide explains the main actions available for students in TrainLink.",
        sections: [
            {
                title: "Browse Internship Opportunities",
                items: [
                    "Go to the Interns page to view available internship opportunities.",
                    "Open any internship card to view the full details, requirements, deadline, work time, and location.",
                    "Use the available information to decide whether the opportunity matches your skills and academic background.",
                ],
            },
            {
                title: "Apply for an Internship",
                items: [
                    "Open the internship details page.",
                    "Click the apply button if the opportunity is available.",
                    "Upload your resume/CV file.",
                    "Upload your cover letter file.",
                    "Submit the application and wait for review.",
                ],
            },
            {
                title: "Track Applications",
                items: [
                    "Go to the Applications page to view your submitted applications.",
                    "Check the application status: Pending, Accepted, or Rejected.",
                    "Open Details to view application information, uploaded files, and rejection notes if available.",
                ],
            },
            {
                title: "My Internships",
                items: [
                    "When your application is accepted, the internship will appear in your Interns page.",
                    "You can track whether the internship is ongoing or finished.",
                    "If the related opportunity was deleted, the system will safely handle it and show available information only.",
                ],
            },
            {
                title: "Edit Profile",
                items: [
                    "Open your profile page.",
                    "Click Edit Profile.",
                    "Update your email, phone number, and skills/interests.",
                    "Click Edit Profile to save the changes.",
                ],
            },
            {
                title: "Change Password",
                items: [
                    "Open your profile page.",
                    "Click Change Password.",
                    "Enter your old password, new password, and confirm the new password.",
                    "Submit the form to update your password.",
                ],
            },
            {
                title: "Use the Forum",
                items: [
                    "Go to the Forums page.",
                    "Create a new topic in the correct category.",
                    "Reply to other topics with questions, answers, or useful knowledge.",
                    "You can delete your own replies.",
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
        title: "Company Help Guide",
        intro: "This guide explains how companies can manage internship opportunities, applications, and company profile information.",
        sections: [
            {
                title: "Manage Internship Opportunities",
                items: [
                    "Go to the Interns page.",
                    "Click Add New Intern to create a new internship opportunity.",
                    "Fill in the title, poster image, description, deadline, period, work time, location, and responsibilities.",
                    "Submit the form to publish the opportunity.",
                ],
            },
            {
                title: "Edit Internship Opportunities",
                items: [
                    "Open the Interns page.",
                    "Use the Edit button on your own internship card.",
                    "Update the opportunity details.",
                    "You may optionally upload a new poster image.",
                    "Save the changes to update the opportunity.",
                ],
            },
            {
                title: "Activate or Deactivate Opportunities",
                items: [
                    "Use the Activate or Deactivate button on your own internship cards.",
                    "Active opportunities can be visible and available for students.",
                    "Inactive opportunities can be temporarily hidden or unavailable.",
                ],
            },
            {
                title: "Delete Internship Opportunities",
                items: [
                    "Use the Delete button on your own internship card.",
                    "Confirm the deletion carefully.",
                    "Applications related to deleted opportunities may still exist, but the deleted job details will no longer be available.",
                ],
            },
            {
                title: "Manage Applications",
                items: [
                    "Go to the Applications page.",
                    "Review applications that were accepted by the admin review process.",
                    "Open Details to view student information, resume, cover letter, and application status.",
                    "Accept or reject pending applications when action is available.",
                ],
            },
            {
                title: "Finish an Internship",
                items: [
                    "Go to the Applications page.",
                    "For accepted and ongoing internships, use the Finish it action when the internship is completed.",
                    "This changes the internship status from Ongoing to Finished.",
                ],
            },
            {
                title: "Edit Company Profile",
                items: [
                    "Open your company profile.",
                    "Click Edit Profile.",
                    "Update company email, phone number, and website.",
                    "The system updates both the company record and the linked company user account.",
                ],
            },
            {
                title: "Use the Forum",
                items: [
                    "Create topics to share knowledge, ask questions, or communicate with students.",
                    "Reply to discussions related to internships and academic support.",
                    "You can delete your own replies.",
                    "You can delete replies inside topics you created.",
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
        title: "Admin Help Guide",
        intro: "This guide explains the main administration tools available for platform management.",
        sections: [
            {
                title: "Manage Students",
                items: [
                    "Go to the Students page.",
                    "View all students in a table format.",
                    "Search students by name, email, student ID, department, or college.",
                    "Use the status button to mark a student as Registered or Not Registered.",
                ],
            },
            {
                title: "Import Students from Excel",
                items: [
                    "Go to the Students page.",
                    "Click Import Excel.",
                    "Upload an Excel file containing student data.",
                    "Existing students with matching studentId will be updated.",
                    "New students in the Excel file will be created.",
                    "Old students not included in the Excel file will be marked as Not Registered.",
                ],
            },
            {
                title: "Manage Companies",
                items: [
                    "Go to the Companies page.",
                    "View contracted companies.",
                    "Add new companies and create their linked company user account.",
                    "Review company information and profile details.",
                ],
            },
            {
                title: "Review Applications",
                items: [
                    "Go to the Applications page.",
                    "Review pending applications.",
                    "Open Details to view student information, opportunity information, resume, and cover letter.",
                    "Mark applications as reviewed or reject them when needed.",
                ],
            },
            {
                title: "Forum Moderation",
                items: [
                    "Go to the Forums page.",
                    "View all forum topics and replies.",
                    "Admin users can delete any reply when moderation is needed.",
                    "Use this carefully to keep discussions clean and useful.",
                ],
            },
            {
                title: "Profile and Password",
                items: [
                    "Open your profile page.",
                    "Update your personal contact information when needed.",
                    "Use Change Password to update your account password.",
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
        title: "ERO Help Guide",
        intro: "This guide explains the main actions available for ERO users in TrainLink.",
        sections: [
            {
                title: "Companies and Contracts",
                items: [
                    "Use the Companies page to review contracted companies when access is available.",
                    "Check company profile information and agreement details.",
                    "Make sure company information is accurate and up to date.",
                ],
            },
            {
                title: "Forum Participation",
                items: [
                    "Go to the Forums page.",
                    "Create topics for announcements, academic support, or general discussion.",
                    "Reply to student or company questions when needed.",
                    "You can delete your own replies.",
                ],
            },
            {
                title: "Profile and Password",
                items: [
                    "Open your profile page.",
                    "Update your email and phone number if available.",
                    "Use Change Password to update your password securely.",
                ],
            },
            {
                title: "General System Use",
                items: [
                    "Use the sidebar to navigate between available pages.",
                    "Keep your account information updated.",
                    "Contact the system administrator if you cannot access a required feature.",
                ],
            },
        ],
        quickLinks: [{ label: "Forums", href: "/forums" }],
    },

    Guest: {
        title: "Help & Support",
        intro: "Welcome to the TrainLink help center. Please log in to see help content based on your account type.",
        sections: [
            {
                title: "About TrainLink",
                items: [
                    "TrainLink connects students, companies, and administrators through internship opportunities.",
                    "Students can apply for internships and track their applications.",
                    "Companies can publish opportunities and manage applications.",
                    "Admins manage users, students, companies, and platform activity.",
                ],
            },
        ],
        quickLinks: [
            { label: "About", href: "/about" },
            { label: "Forums", href: "/forums" },
        ],
    },
};

export default async function HelpPage() {
    const loggedUser = await getAuthUser();
    const role = loggedUser?.role || "Guest";
    const content = helpContent[role] || helpContent.Guest;

    return (
        <div className="content">
            <div className="help-page">
                <h2>{content.title}</h2>

                <p>{content.intro}</p>

                <section className="help-section">
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
                                style={{
                                    textDecoration: "none",
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </section>

                {content.sections.map((section) => (
                    <section className="help-section" key={section.title}>
                        <h3>{section.title}</h3>
                        <ul>
                            {section.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </section>
                ))}

                <section className="help-section">
                    <h3>Need More Help?</h3>
                    <p>
                        If you still need assistance, please contact the system
                        administrator or your organization support team.
                    </p>
                </section>
            </div>
        </div>
    );
}
