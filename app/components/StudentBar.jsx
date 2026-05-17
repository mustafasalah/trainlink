"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import useLoggedUser from "../hooks/useLoggedUser";

export default function StudentBar() {
    const pathname = usePathname();
    const loggedUser = useLoggedUser();

    return (
        <div className="student-bar">
            <div className="profile">
                {loggedUser.profileImage ? (
                    <Image
                        src={loggedUser.profileImage}
                        alt=""
                        width={70}
                        height={70}
                    />
                ) : (
                    <h2 className={loggedUser.role}>
                        {loggedUser.fullName.substring(0, 1).toUpperCase()}
                    </h2>
                )}
                <h4>{loggedUser.fullName}</h4>
                <span>{loggedUser.specialization}</span>
                <p>
                    {" "}
                    <span>{loggedUser.role} Account</span>
                </p>
            </div>
            <div className="settings">
                <ul>
                    <li>
                        <Link
                            className={pathname === "/profile" ? "active" : ""}
                            href="/profile"
                        >
                            My Profile
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={pathname === "/help" ? "active" : ""}
                            href="/help"
                        >
                            Help
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={pathname === "/about" ? "active" : ""}
                            href="/about"
                        >
                            About
                        </Link>
                    </li>
                    <li>
                        <Link href="/logout">Logout</Link>
                    </li>
                </ul>
            </div>
            {/* {loggedUser.role === "Student" ? (
                <div className="certificate">
                    <p>My Certificate</p>
                    {loggedUser.certifications.map(({ title }) => (
                        <div key={title} className="certifi-bord">
                            <Image
                                src="/img/certificate-quality-award-education-medal-svgrepo-com.svg"
                                alt=""
                                width={50}
                                height={50}
                            />
                            <p>{title}</p>
                        </div>
                    ))}
                </div>
            ) : (
                ""
            )} */}
        </div>
    );
}
