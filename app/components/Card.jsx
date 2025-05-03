import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Card({ url, thumbnailUrl, title, description }) {
    return (
        <div className="card">
            <div className="card-img">
                <Image src={thumbnailUrl} alt="" width={280} height={120} />
            </div>
            <div className="card-info">
                <p>{title}</p>
                <p>{description}</p>
            </div>
            <div className="footer-card">
                <Link className="btn-card" href={url}>
                    View details <i className="icon-chevron-right"></i>
                </Link>
            </div>
        </div>
    );
}
