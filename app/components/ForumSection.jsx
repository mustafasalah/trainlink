import React from "react";
import TopicItem from "./TopicItem";

export default function ForumSection({ title, description, topics }) {
    return (
        <section className="forum-section">
            <header>
                <h3>
                    {title} <span>({topics.length})</span>
                </h3>
                <p>{description}</p>
            </header>

            <ul className="topics-list">
                {topics.map((topic) => (
                    <TopicItem {...topic} />
                ))}
            </ul>
        </section>
    );
}
