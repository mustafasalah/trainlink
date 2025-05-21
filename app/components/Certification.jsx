import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Certification({
    info: { id, title, issueDate, issuer },
}) {
    return (
        <div>
            <div className="certificate">
                <Image
                    src="/img/certificate.svg"
                    alt={title}
                    width={50}
                    height={50}
                />
                <div>
                    <p>{title}</p>
                    <p
                        style={{
                            color: "#777",
                            fontSize: ".8em",
                            marginTop: 2,
                        }}
                    >
                        Prvoided by <strong>{issuer}</strong> in{" "}
                        <time
                            style={{ fontStyle: "italic" }}
                            dateTime={issueDate}
                        >
                            {issueDate}
                        </time>
                    </p>
                </div>
            </div>
            <Link href={`/certifications/${id}`}>Download</Link>
        </div>
    );
}
