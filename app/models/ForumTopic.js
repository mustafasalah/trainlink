import mongoose from "mongoose";

const forumTopicSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: ["General Discussion", "Academic Support"],
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        authorId: {
            // store user _id as string or ObjectId; your User schema uses String ids in some places
            type: String,
            required: true,
        },
        authorName: {
            type: String,
            required: true,
            trim: true,
        },
        repliesCount: {
            // how many replies the topic has
            type: Number,
            default: 0,
            required: true,
        },
        // optional: last activity time (for sorting)
        lastActivityAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // adds createdAt + updatedAt
    }
);

const ForumTopic =
    mongoose.models.ForumTopic ||
    mongoose.model("ForumTopic", forumTopicSchema);

export default ForumTopic;
