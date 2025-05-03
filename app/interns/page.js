import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function page() {
    return (
        <div className="content">
            <div className="interns">
                <div className="interns-first-content">
                    <div className="tabs">
                        <Link className="active" href="">
                            All
                        </Link>
                        <Link href="">Ongoing</Link>
                        <Link href="">Finished</Link>
                    </div>
                    <div className="interns-cards">
                        <div className="card">
                            <div className="card-img">
                                <Image
                                    src="/img/img4.jpg"
                                    alt=""
                                    width={280}
                                    height={120}
                                />
                                <span id="ongoing">Ongoing</span>
                                <p>Data Analytics</p>
                            </div>
                            <div className="card-info">
                                <p>Canar Telecom</p>
                                <span>
                                    <i className="icon-map-pin"></i>Khartoum,
                                    Almogran
                                </span>
                                <span>
                                    <i className="icon-calendar"></i>Period:
                                    2025-06-15 to 2025-09-15
                                </span>
                                <span>
                                    <i className="icon-clock"></i>Part-time
                                </span>
                                <span>
                                    <i className="icon-users"></i>120 student
                                    applied
                                </span>
                            </div>
                            <div className="footer-card">
                                <span>
                                    <i className="icon-history"></i>3 days ago
                                </span>
                                <Link href="">
                                    View details{" "}
                                    <i className="icon-chevron-right"></i>
                                </Link>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-img">
                                <Image
                                    src="/img/img4.jpg"
                                    alt=""
                                    width={280}
                                    height={120}
                                />
                                <span id="finished">Finished</span>
                                <p>Network Engineer</p>
                            </div>
                            <div className="card-info">
                                <p>Dal Group</p>
                                <span>
                                    <i className="icon-map-pin"></i>North
                                    Khartoum, Industral Area
                                </span>
                                <span>
                                    <i className="icon-calendar"></i>Period:
                                    2025-06-15 to 2025-09-15
                                </span>
                                <span>
                                    <i className="icon-clock"></i>Part-time
                                </span>
                                <span>
                                    <i className="icon-users"></i>20 student
                                    applied
                                </span>
                            </div>
                            <div className="footer-card">
                                <span>
                                    <i className="icon-history"></i>1 month ago
                                </span>
                                <Link href="">
                                    View details{" "}
                                    <i className="icon-chevron-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="available-interns">
                    <h3>
                        Available Interns<span>(12)</span>
                    </h3>
                    <div className="cards">
                        <div className="card">
                            <div className="card-img">
                                <Image
                                    src="/img/img1.jpg"
                                    alt=""
                                    width={280}
                                    height={120}
                                />
                                <p>Technical Support</p>
                            </div>
                            <div className="card-info">
                                <p>Zain Sudan</p>
                                <span>
                                    <i className="icon-map-pin"></i>
                                    Khartoum-Riyadh
                                </span>
                                <span>
                                    <i className="icon-calendar"></i>8 weeks
                                </span>
                                <span>
                                    <i className="icon-clock"></i>Part-time
                                </span>
                                <span>
                                    <i className="icon-users"></i>120 student
                                    applied
                                </span>
                            </div>
                            <div className="footer-card">
                                <span>
                                    <i className="icon-history"></i>5 days ago
                                </span>
                                <Link href="">
                                    View details{" "}
                                    <i className="icon-chevron-right"></i>
                                </Link>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-img">
                                <Image
                                    src="/img/img2.jpg"
                                    alt=""
                                    width={280}
                                    height={120}
                                />
                                <p>Full-Stack Developer</p>
                            </div>
                            <div className="card-info">
                                <p>Canar Telecom</p>
                                <span>
                                    <i className="icon-map-pin"></i>
                                    Khartoum-Riyadh
                                </span>
                                <span>
                                    <i className="icon-calendar"></i>8 weeks
                                </span>
                                <span>
                                    <i className="icon-clock"></i>Part-time
                                </span>
                                <span>
                                    <i className="icon-users"></i>20 student
                                    applied
                                </span>
                            </div>
                            <div className="footer-card">
                                <span>
                                    <i className="icon-history"></i>2 days ago
                                </span>
                                <Link href="">
                                    View details{" "}
                                    <i className="icon-chevron-right"></i>
                                </Link>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-img">
                                <Image
                                    src="/img/img4.jpg"
                                    alt=""
                                    width={280}
                                    height={120}
                                />
                                <p>Data Analytics</p>
                            </div>
                            <div className="card-info">
                                <p>Giad Industrial Group</p>
                                <span>
                                    <i className="icon-map-pin"></i>
                                    Khartoum-Riyadh
                                </span>
                                <span>
                                    <i className="icon-calendar"></i>6 weeks
                                </span>
                                <span>
                                    <i className="icon-clock"></i>Full-time
                                </span>
                                <span>
                                    <i className="icon-users"></i>12 student
                                    applied
                                </span>
                            </div>
                            <div className="footer-card">
                                <span>
                                    <i className="icon-history"></i>3 days ago
                                </span>
                                <Link href="">
                                    View details{" "}
                                    <i className="icon-chevron-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="view-more">
                        <button>View More</button>
                        <p>(3 of 12 Training Opportunities)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
