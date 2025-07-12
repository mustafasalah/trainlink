import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
    {
        /**
         * Reference to the specific Application document that led to this accepted internship.
         */
        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
            required: true,
            unique: true, // Ensures one application corresponds to one accepted internship record
        },
        /**
         * Direct reference to the Student User.
         */
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        /**
         * Direct reference to the Company User. This value will come from the JobPosting
         * referenced by the Application when the Internship record is created.
         */
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        /**
         * The official start date of the internship.
         */
        startDate: {
            type: Date,
            required: true,
        },
        /**
         * The official end date of the internship.
         */
        endDate: {
            type: Date,
            required: true,
        },
        /**
         * The current status of the internship agreement.
         */
        status: {
            type: String,
            enum: ["Ongoing", "Finished", "Cancelled"],
            default: "Ongoing",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

internshipSchema.index({ student: 1 });
internshipSchema.index({ company: 1 });
internshipSchema.index({ status: 1 });

const Internship =
    mongoose.models.Internship ||
    mongoose.model("Internship", internshipSchema);

export default Internship;
