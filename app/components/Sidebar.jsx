"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="sidebar">
            <h3>TrainLink</h3>
            <ul>
                <li>
                    <Link className={pathname === "/" ? "active" : ""} href="/">
                        <i className="icon-house"></i>
                        <span>Home</span>
                    </Link>
                </li>
                <li>
                    <Link
                        className={
                            pathname.startsWith("/companies") ? "active" : ""
                        }
                        href="/companies"
                    >
                        <i className="icon-building-2"></i>
                        <span>Companies</span>
                    </Link>
                </li>
                <li>
                    <Link
                        className={
                            pathname.startsWith("/applications") ? "active" : ""
                        }
                        href="/applications"
                    >
                        <i className="icon-history"></i>
                        <span>Applications</span>
                    </Link>
                </li>
                <li>
                    <Link
                        className={
                            pathname.startsWith("/interns") ? "active" : ""
                        }
                        href="/interns"
                    >
                        <i className="icon-graduation-cap"></i>
                        <span>Interns</span>
                    </Link>
                </li>
                <li>
                    <Link
                        className={
                            pathname.startsWith("/vision") ? "active" : ""
                        }
                        href="/vision"
                    >
                        <i className="icon-route"></i>
                        <span>Vision Map</span>
                    </Link>
                </li>
                <li>
                    <Link
                        className={
                            pathname.startsWith("/forums") ? "active" : ""
                        }
                        href="/forums"
                    >
                        <i className="icon-message-circle-question"></i>
                        <span>Forums</span>
                    </Link>
                </li>
                <li>
                    <Link
                        className={
                            pathname.startsWith("/settings") ? "active" : ""
                        }
                        href="/settings"
                    >
                        <i className="icon-settings"></i>
                        <span>Settings</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
}
