import React from "react";
import ApplicationRow from "../components/ApplicationRow";
import Link from "next/link";
import TopicItem from "../components/TopicItem";
import ForumSection from "../components/ForumSection";

export default async function Forums() {
    // const data = await fetch("http://localhost:3000/api/applications");
    // const applications = await data.json();

    const generalTopics = [
        {
            id: 1,
            title: "Welcome New Users! Introduce Yourselves",
            authorId: 2,
            authorName: "Ali Ahmed",
            replies: 3,
            dateTime: "2025-05-11 12:48:03",
        },
        {
            id: 2,
            title: "Discussion about Full-Stack Development Internship",
            authorId: 3,
            authorName: "Sarah Mohamed",
            replies: 5,
            dateTime: "2025-05-10 01:18:23",
        },
        {
            id: 3,
            title: "Suggestion for New Feature",
            authorId: 1,
            authorName: "Rasha Salah",
            replies: 9,
            dateTime: "2025-05-01 22:18:12",
        },
    ];

    const supportTopics = [
        {
            id: 4,
            title: "Need help understanding Convolutional Neural Networks (CNNs)",
            authorId: 5,
            authorName: "Aisha_CS",
            replies: 7,
            dateTime: "2025-05-09 12:48:03",
        },
        {
            id: 5,
            title: "Study group for Database Management Systems?",
            authorId: 6,
            authorName: "Kamal_IT",
            replies: 12,
            dateTime: "2025-05-06 01:18:23",
        },
        {
            id: 6,
            title: "Looking for resources on Advanced Algorithms",
            authorId: 8,
            authorName: "Ibrahim",
            replies: 4,
            dateTime: "2025-05-04 22:18:12",
        },
    ];

    return (
        <div className="content">
            <div className="forums applications">
                <h3>Forums</h3>
                <div className="apps-search-form">
                    <div className="app-search-status">
                        <div className="search-box">
                            <input
                                type="search"
                                name=""
                                id=""
                                placeholder="Search for specific topic"
                            />
                        </div>
                    </div>
                    <div className="items">
                        <button className="">Create a New Topic</button>
                    </div>
                </div>
                <div className="apps-form">
                    <ForumSection
                        title="General Discussion"
                        description="A space for general discussion, announcements,
                                and platform feedback."
                        topics={generalTopics}
                    />
                    <ForumSection
                        title="Academic Support"
                        description="Discuss study tips, ask for help with coursework, and share academic resources."
                        topics={supportTopics}
                    />
                    {/* <div className="view-more">
                        <button>View More</button>
                        <p>(2 of {applications.length} Applications)</p>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
