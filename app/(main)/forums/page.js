import React from "react";
import ForumSection from "../../components/ForumSection";
import CreateTopicModal from "@/app/components/CreateTopicModal";
import connectDB from "@/app/DBconnection";
import ForumTopic from "@/app/models/ForumTopic";

export default async function Forums({ searchParams }) {
    const q = ((await searchParams?.q) || "").trim();

    // 1) Connect to MongoDB
    await connectDB();

    // 2) Build filter based on search query
    const filter = q
        ? {
              $or: [
                  { title: { $regex: q, $options: "i" } },
                  { message: { $regex: q, $options: "i" } },
              ],
          }
        : {};

    // 3) Fetch topics (filtered if q exists), newest first
    const rawTopics = await ForumTopic.find(filter)
        .sort({ createdAt: -1 })
        .lean();

    // 4) Helper to map DB document -> TopicItem props
    const mapTopic = (t) => ({
        id: t._id.toString(),
        title: t.title,
        authorId: t.authorId,
        authorName: t.authorName,
        replies: t.repliesCount ?? 0,
        dateTime: new Date(t.createdAt)
            .toISOString()
            .slice(0, 19)
            .replace("T", " "),
    });

    // 5) Split by category
    const generalTopics = rawTopics
        .filter((t) => t.category === "General Discussion")
        .map(mapTopic);

    const supportTopics = rawTopics
        .filter((t) => t.category === "Academic Support")
        .map(mapTopic);

    return (
        <div className="content">
            <div className="forums">
                <h3>Forums</h3>

                <div className="apps-search-form">
                    <div className="app-search-status">
                        <div className="search-box">
                            {/* GET form so ?q=... appears in URL */}
                            <form>
                                <input
                                    type="search"
                                    name="q"
                                    placeholder="Search for specific topic"
                                    defaultValue={q}
                                />
                            </form>
                        </div>
                    </div>
                    <div className="items">
                        <CreateTopicModal />
                    </div>
                </div>

                <div className="apps-form">
                    <ForumSection
                        title="GENERAL DISCUSSION"
                        description="A space for general discussion, announcements, and platform feedback."
                        topics={generalTopics}
                    />

                    <ForumSection
                        title="ACADEMIC SUPPORT"
                        description="Discuss study tips, ask for help with coursework, and share academic resources."
                        topics={supportTopics}
                    />
                </div>
            </div>
        </div>
    );
}
