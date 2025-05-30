import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        issueDate: {
            type: Date,
            required: true,
        },
        issuer: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false }
); // Set _id to false if you don't need a separate _id for subdocuments

const academicSchema = new mongoose.Schema(
    {
        department: {
            type: String,
            required: true,
            trim: true,
        },
        college: {
            type: String,
            required: true,
            trim: true,
        },
        year: {
            type: String, // Storing as string to accommodate "4th Year", "3rd Year", etc.
            required: true,
            trim: true,
        },
        gpa: {
            type: Number,
            required: false, // GPA might not always be available or applicable
        },
        skills: {
            type: String, // Storing as a comma-separated string, consider [String] for an array of skills
            required: false,
            trim: true,
        },
    },
    { _id: false }
); // Set _id to false if you don't need a separate _id for subdocuments

const userSchema = new mongoose.Schema(
    {
        profileImage: {
            type: String,
            required: false,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        specialization: {
            type: String,
            required: true,
            trim: true,
        },
        studentId: {
            type: String,
            required: true,
            unique: true, // Student ID is unique for each user
            trim: true,
        },
        about: {
            type: String,
            required: false, // The 'about' field can be optional
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Email addresses should be unique
            trim: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
            required: false, // Phone number might be optional
            trim: true,
        },
        academic: {
            type: academicSchema,
            required: true, // Assuming academic information is required for an intern user
        },
        certifications: {
            type: [certificationSchema], // Array of certification subdocuments
            default: [], // Default to an empty array if no certifications are provided
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
