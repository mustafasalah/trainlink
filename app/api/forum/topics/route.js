import { NextResponse } from "next/server";
import connectDB from "@/app/DBconnection";
import ForumTopic from "@/app/models/ForumTopic";

export async function POST(request) {
    try {
        await connectDB();

        const { title, category, message, authorId, authorName } =
            await request.json();

        if (
            !title ||
            !title.trim() ||
            !category ||
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

        const topic = await ForumTopic.create({
            title: title.trim(),
            category,
            message: message.trim(),
            authorId,
            authorName,
        });

        return NextResponse.json(
            {
                ok: true,
                topic: {
                    _id: topic._id.toString(),
                    title: topic.title,
                    category: topic.category,
                    message: topic.message,
                    authorId: topic.authorId,
                    authorName: topic.authorName,
                    repliesCount: topic.repliesCount,
                    createdAt: topic.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Error creating forum topic:", err);
        return NextResponse.json(
            { error: "Failed to create topic." },
            { status: 500 }
        );
    }
}
