import React from "react";
import connectDB from "@/app/DBconnection";
import ForumTopic from "@/app/models/ForumTopic";
import ForumReply from "@/app/models/ForumReply";
import User from "@/app/models/User"; // <── ADD THIS
import { format } from "timeago.js";
import ReplyForm from "@/app/components/ReplyForm";

export default async function TopicPage({ params }) {
    const { id } = await params;

    await connectDB();

    const topic = await ForumTopic.findById(id).lean();
    if (!topic) {
        return (
            <div className="content">
                <p>Topic not found.</p>
            </div>
        );
    }

    // Fetch replies first
    const replies = await ForumReply.find({ topicId: id })
        .sort({ createdAt: 1 })
        .lean();

    // Fetch avatar for each reply
    const repliesWithAvatar = await Promise.all(
        replies.map(async (reply) => {
            const user = await User.findById(reply.authorId).lean();
            return {
                ...reply,
                authorAvatar: user?.profileImage || "/img/default-avatar.png",
            };
        })
    );

    const createdAtStr = new Date(topic.createdAt)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

    return (
        <div className="content">
            <div className="head-disc">
                <div className="title">
                    <h3>{topic.title}</h3>
                    <span>
                        Author:{" "}
                        <a href={`/users/${topic.authorId}`}>
                            {topic.authorName}
                        </a>
                        <i className="icon-dot"></i>
                        <span>
                            <time dateTime={topic.createdAt.toString()}>
                                {createdAtStr}
                            </time>
                        </span>
                    </span>
                </div>

                <div className="disc-box">
                    <p>{topic.message}</p>
                </div>
            </div>

            <div className="disc-content">
                <div className="replies">
                    <div className="title">
                        <h4>Replies</h4>
                        <span>({repliesWithAvatar.length})</span>
                    </div>

                    <div className="replies-content">
                        {repliesWithAvatar.length === 0 ? (
                            <p>No replies yet. Be the first to reply.</p>
                        ) : (
                            repliesWithAvatar.map((reply) => (
                                <div
                                    className="reply-box"
                                    key={reply._id.toString()}
                                >
                                    <img src={reply.authorAvatar} alt="" />
                                    <div className="box">
                                        <div className="name-time-disc">
                                            <span>{reply.authorName}</span>
                                            <p>{format(reply.createdAt)}</p>
                                        </div>
                                        <div className="disc-box">
                                            <p>{reply.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <ReplyForm topicId={id} />
            </div>
        </div>
    );
}
