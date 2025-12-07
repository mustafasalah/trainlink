import mongoose from "mongoose";

const forumReplySchema = new mongoose.Schema(
    {
        topicId: {
            type: String,
            required: true,
            index: true,
        },
        authorId: {
            type: String,
            required: true,
        },
        authorName: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
);

const ForumReply =
    mongoose.models.ForumReply ||
    mongoose.model("ForumReply", forumReplySchema);

export default ForumReply;
