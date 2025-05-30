import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        thumbnailUrl: {
            type: String,
            required: false,
            trim: true,
        },
        status: {
            type: String,
            enum: ["ongoing", "finished", null], // Includes null for cases where status isn't set
            default: null,
        },
        companyId: {
            type: String,
            required: true,
        },
        companyName: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        period: {
            type: String, // e.g., "8 weeks", consider separate fields for number and unit if more granular queries are needed
            required: true,
            trim: true,
        },
        workTime: {
            type: String,
            enum: ["part-time", "full-time"],
            required: true,
            trim: true,
        },
        appliedCounter: {
            type: Number,
            required: true,
            default: 0,
        },
        deadline: {
            type: Date,
            required: true,
        },
        datetime: {
            type: Date,
            required: true,
            default: Date.now,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        responsibilities: {
            type: String, // Storing as a single string, consider array of strings if each responsibility is a separate item
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default Job;
