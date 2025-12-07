// app/api/forum/topics/[id]/replies/route.js

import { NextResponse } from "next/server";
import connectDB from "@/app/DBconnection";
import ForumReply from "@/app/models/ForumReply";
import ForumTopic from "@/app/models/ForumTopic";

export async function POST(request, { params }) {
    try {
        await connectDB();

        const { id: topicId } = params;
        const body = await request.json();
        const { message, authorId, authorName } = body || {};

        if (
            !topicId ||
            !message ||
            !message.trim() ||
            !authorId ||
            !authorName
        ) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        // Ensure topic exists
        const topic = await ForumTopic.findById(topicId);
        if (!topic) {
            return NextResponse.json(
                { error: "Topic not found." },
                { status: 404 }
            );
        }

        // Create reply
        const reply = await ForumReply.create({
            topicId: topicId.toString(),
            authorId,
            authorName,
            message: message.trim(),
        });

        // Update topic counters/last activity
        topic.repliesCount = (topic.repliesCount || 0) + 1;
        topic.lastActivityAt = new Date();
        await topic.save();

        return NextResponse.json(
            {
                ok: true,
                reply: {
                    _id: reply._id.toString(),
                    topicId: reply.topicId,
                    authorId: reply.authorId,
                    authorName: reply.authorName,
                    message: reply.message,
                    createdAt: reply.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Error creating reply:", err);
        return NextResponse.json(
            { error: "Failed to create reply." },
            { status: 500 }
        );
    }
}
