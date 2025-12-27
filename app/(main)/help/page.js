import React from "react";

export const metadata = {
    title: "Help & Support",
};

export default function HelpPage() {
    return (
        <div className="content">
            <div className="help-page">
                <h2>Help & Support</h2>
                <p>
                    Welcome to the TrainLink help center. Here you’ll find
                    answers to common questions and guidance on how to use the
                    platform.
                </p>

                {/* STUDENTS */}
                <section className="help-section">
                    <h3>For Students</h3>
                    <ul>
                        <li>
                            Browse available internships from the Interns page.
                        </li>
                        <li>
                            Apply for internships by uploading your CV and cover
                            letter.
                        </li>
                        <li>
                            Track your application status from the Applications
                            page.
                        </li>
                        <li>
                            Join discussions and ask questions in the Forum.
                        </li>
                        <li>Complete your profile to improve your chances.</li>
                    </ul>
                </section>

                {/* COMPANIES */}
                <section className="help-section">
                    <h3>For Companies</h3>
                    <ul>
                        <li>Create and manage internship opportunities.</li>
                        <li>Edit, activate, or deactivate your internships.</li>
                        <li>View and manage student applications.</li>
                        <li>Approve or reject applications.</li>
                        <li>Participate in forum discussions.</li>
                    </ul>
                </section>

                {/* ADMINS / ERO */}
                <section className="help-section">
                    <h3>For Admins / ERO</h3>
                    <ul>
                        <li>Manage users and companies.</li>
                        <li>Review platform activity and applications.</li>
                        <li>Ensure system rules and policies are followed.</li>
                    </ul>
                </section>

                {/* GENERAL */}
                <section className="help-section">
                    <h3>General Tips</h3>
                    <ul>
                        <li>
                            Make sure your profile information is always up to
                            date.
                        </li>
                        <li>
                            Use the search feature to find internships or forum
                            topics.
                        </li>
                        <li>Check deadlines carefully before applying.</li>
                        <li>
                            Contact support if you face any technical issues.
                        </li>
                    </ul>
                </section>

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
