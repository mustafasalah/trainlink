import Image from "next/image";
import React from "react";
import { getAuthToken, getAuthUser } from "@/app/auth";
import EditProfileSection from "@/app/components/EditProfileSection";
import CompanyProfile from "@/app/components/CompanyProfile";
import Certification from "@/app/components/Certification";

export const dynamic = "force-dynamic";

export default async function page({ params }) {
    const userId = (await params).id;
    const data = await fetch(`http://localhost:3000/api/users/${userId}`);
    const user = await data.json();
    const loggedUser = await getAuthUser();
    const isSameLoggedUser = loggedUser.id === user._id;

    if (user.role === "Company") {
        const companyId = user.companyId;
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

        return (
            <>
                <div className="head-title">
                    <h3>{user.fullName}'s Profile</h3>
                    {isSameLoggedUser ? (
                        <div className="buttons">
                            <button className="">Edit Profile</button>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                <CompanyProfile company={company} jobs={jobs} />
            </>
        );
    }

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
                    {isSameLoggedUser ? <EditProfileSection user={user} /> : ""}
                </div>
                <div className="student-profile-info">
                    <div className="basic-info">
                        <h3>Basic Information</h3>
                        <ul>
                            <li>
                                <i className="icon-circle-user-round"></i>Full
                                Name: {user.fullName}
                            </li>
                            {user.studentId ? (
                                <li>
                                    <i className="icon-fingerprint"></i>Student
                                    ID:
                                    {user.studentId}
                                </li>
                            ) : (
                                ""
                            )}
                            {user.email ? (
                                <li>
                                    <i className="icon-mail"></i>Email Address:
                                    {user.email}
                                </li>
                            ) : (
                                ""
                            )}
                            {user.phoneNumber ? (
                                <li>
                                    <i className="icon-phone"></i>Phone Number:{" "}
                                    {user.phoneNumber}
                                </li>
                            ) : (
                                ""
                            )}
                        </ul>
                    </div>
                    {user.role === "Student" ? (
                        <>
                            <div className="academic-details">
                                <h3>Academic Details</h3>
                                <ul>
                                    {user.academic?.department ? (
                                        <li>
                                            Department/Major:{" "}
                                            {user.academic.department}
                                        </li>
                                    ) : (
                                        ""
                                    )}
                                    {user.academic?.college ? (
                                        <li>
                                            Faculty/College:{" "}
                                            {user.academic.college}
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
                                        <li>
                                            Cumulative GPA: {user.academic.gpa}
                                        </li>
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
                            {/* <div className="my-certification">
                                <h3>My Certifications</h3>
                                {user.certifications.map((certification) => (
                                    <Certification
                                        key={certification.title}
                                        info={certification}
                                    />
                                ))}
                            </div> */}
                        </>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
}
