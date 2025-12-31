import connectDB from "@/app/DBconnection";
import ForumReply from "@/app/models/ForumReply";
import ForumTopic from "@/app/models/ForumTopic";
import { getAuthUser } from "@/app/auth";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    const loggedUser = await getAuthUser(true);
    if (!loggedUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const replyId = params.replyId;

    const reply = await ForumReply.findById(replyId).lean();
    if (!reply) {
        return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }

    const topic = await ForumTopic.findById(reply.topicId).lean();
    if (!topic) {
        if (loggedUser.role !== "Admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
    }

    const isAdmin = loggedUser.role === "Admin";
    const isReplyOwner =
        reply.authorId?.toString() === loggedUser.id?.toString();
    const isTopicOwner =
        topic?.authorId?.toString() === loggedUser.id?.toString();

    const canDelete = isAdmin || isReplyOwner || isTopicOwner;

    if (!canDelete) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await ForumReply.deleteOne({ _id: replyId });

    await ForumTopic.updateOne(
        { _id: reply.topicId },
        { $inc: { repliesCount: -1 } }
    );

    return NextResponse.json({ ok: true }, { status: 200 });
}
