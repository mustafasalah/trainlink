import Image from "next/image";
import React from "react";
import Certification from "../components/Certification";
import Modal from "../components/Modal";
import EditProfileSection from "../components/EditProfileSection";

export default async function page({ params }) {
    const userId = 1; //await params.id;
    const userData = await fetch(`http://localhost:3000/api/users/${userId}`);
    const user = await userData.json();

    return (
        <div className="content">
            <div className="student-profile">
                <div className="student">
                    <div className="profile">
                        <Image
                            src={user.profileImage}
                            alt=""
                            width={70}
                            height={70}
                        />
                        <div className="student-name">
                            <h3>{user.fullName}</h3>
                            <p>{user.specialization}</p>
                        </div>
                    </div>
                    <EditProfileSection />
                </div>
                <div className="student-profile-info">
                    <div className="basic-info">
                        <h3>Basic Information</h3>
                        <ul>
                            <li>
                                <i className="icon-circle-user-round"></i>Full
                                Name: {user.fullName}
                            </li>
                            <li>
                                <i className="icon-fingerprint"></i>Student ID:
                                {user.studentId}
                            </li>
                            <li>
                                <i className="icon-mail"></i>Email Address:
                                {user.email}
                            </li>
                            <li>
                                <i className="icon-phone"></i>Phone Number:{" "}
                                {user.phoneNumber}
                            </li>
                        </ul>
                    </div>
                    <div className="academic-details">
                        <h3>Academic Details</h3>
                        <ul>
                            {user.academic?.department ? (
                                <li>
                                    Department/Major: {user.academic.department}
                                </li>
                            ) : (
                                ""
                            )}
                            {user.academic?.college ? (
                                <li>
                                    Faculty/College: {user.academic.college}
                                </li>
                            ) : (
                                ""
                            )}
                            {user.academic?.year ? (
                                <li>
                                    Year of Study/Graduation Year:{" "}
                                    {user.academic.year}
                                </li>
                            ) : (
                                ""
                            )}
                            {user.academic?.gpa ? (
                                <li>Cumulative GPA: {user.academic.gpa}</li>
                            ) : (
                                ""
                            )}
                            {user.academic?.skills ? (
                                <li>
                                    Relevant Skills/Interests:{" "}
                                    {user.academic.skills}
                                </li>
                            ) : (
                                ""
                            )}
                        </ul>
                    </div>
                    <div className="my-certification">
                        <h3>My Certifications</h3>
                        {user.certifications.map((certification) => (
                            <Certification
                                key={certification.id}
                                info={certification}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
