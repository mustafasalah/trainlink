"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function StudentBar() {
    const pathname = usePathname();

    return (
        <div className="student-bar">
            <div className="profile">
                <Image
                    src="/img/rasha profile.png"
                    alt=""
                    width={70}
                    height={70}
                />
                <h4>Rasha Salah</h4>
                <span>Information Technology</span>
                <p>
                    {" "}
                    UI/UX <span>Trainee</span>
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
            <div className="certificate">
                <p>My Certificate</p>
                <div className="certifi-bord">
                    <Image
                        src="/img/certificate-quality-award-education-medal-svgrepo-com.svg"
                        alt=""
                        width={50}
                        height={50}
                    />
                    <p>UX Research</p>
                </div>
                <div className="certifi-bord">
                    <Image
                        src="/img/certificate-quality-award-education-medal-svgrepo-com.svg"
                        alt=""
                        width={50}
                        height={50}
                    />
                    <p>Build Wireframes</p>
                </div>
                <div className="certifi-bord">
                    <Image
                        src="/img/certificate-quality-award-education-medal-svgrepo-com.svg"
                        alt=""
                        width={50}
                        height={50}
                    />
                    <p>Foundations of UX</p>
                </div>
            </div>
        </div>
    );
}
