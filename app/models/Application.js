import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        /**
         * Reference to the Student User who submitted this application.
         */
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        /**
         * Reference to the specific JobPosting this application is for.
         */
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        /**
         * The date when the application was submitted by the student.
         */
        applicationDate: {
            type: Date,
            default: Date.now,
            required: true,
        },
        /**
         * The current status of this application in the recruitment pipeline.
         */
        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected"],
            default: "Pending",
            required: true,
        },
        /**
         * Optional field for any notes or comments from the company or admin regarding this application.
         */
        notes: {
            type: String,
            required: false,
            trim: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps automatically
    }
);

// Create the Mongoose model from the schema
const Application =
    mongoose.models.Application ||
    mongoose.model("Application", applicationSchema);

export default Application;
