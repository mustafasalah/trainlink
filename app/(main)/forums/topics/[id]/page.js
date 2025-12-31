import React from "react";
import connectDB from "@/app/DBconnection";
import ForumTopic from "@/app/models/ForumTopic";
import ForumReply from "@/app/models/ForumReply";
import User from "@/app/models/User";
import ReplyForm from "@/app/components/ReplyForm";
import ReplyItem from "@/app/components/ReplyItem";
import { getAuthUser } from "@/app/auth";

export default async function TopicPage({ params }) {
    const { id } = await params;

    const loggedUser = await getAuthUser(true);

    await connectDB();

    const topic = await ForumTopic.findById(id).lean();
    if (!topic) {
        return (
            <div className="content">
                <p>Topic not found.</p>
            </div>
        );
    }

    const replies = await ForumReply.find({ topicId: id })
        .sort({ createdAt: 1 })
        .lean();

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

    const isAdmin = loggedUser?.role === "Admin";
    const isTopicOwner =
        loggedUser?.id?.toString() === topic.authorId?.toString();

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
                            repliesWithAvatar.map((reply) => {
                                const isReplyOwner =
                                    loggedUser?.id?.toString() ===
                                    reply.authorId?.toString();

                                const canDelete =
                                    isAdmin || isTopicOwner || isReplyOwner;

                                return (
                                    <ReplyItem
                                        key={reply._id.toString()}
                                        reply={{
                                            ...reply,
                                            _id: reply._id.toString(),
                                        }}
                                        canDelete={canDelete}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>

                <ReplyForm topicId={id} />
            </div>
        </div>
    );
}
