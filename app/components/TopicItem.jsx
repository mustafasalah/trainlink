import Link from "next/link";
import React from "react";

export default function TopicItem({
    id,
    title,
    authorId,
    authorName,
    replies,
    dateTime,
}) {
    return (
        <li className="topic-item">
            <div>
                <Link className="topic-title" href={`/forums/${id}`}>
                    {title}
                </Link>
                <p className="topic-info">
                    <span>
                        <i className="icon-user-round"></i>{" "}
                        <a href={`/users/${authorId}`}>{authorName}</a>
                    </span>{" "}
                    <span>/</span>
                    <span>
                        <i className="icon-message-square"></i> {replies}
                    </span>
                </p>
            </div>
            <time dateTime={dateTime}>{dateTime}</time>
        </li>
    );
}
