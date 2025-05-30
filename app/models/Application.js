import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        internId: {
            type: String,
            required: true,
            unique: false, // Set to true if each internId should only have one application
        },
        title: {
            type: String,
            required: true,
            trim: true, // Removes whitespace from both ends of a string
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "approved", "rejected", "in review"], // Example of allowed values
            default: "pending", // Set a default status for new applications
        },
        datetime: {
            type: Date,
            required: true,
            default: Date.now, // Sets the default to the current date/time when created
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
