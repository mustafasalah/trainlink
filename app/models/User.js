import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
        registered: {
            type: Boolean,
            default: false,
            required: true,
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
            trim: true,
        },
        studentId: {
            type: String,
            required: false,
            unique: true,
            sparse: true,
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
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: [6, "Password must be at least 6 characters long"],
            select: false, // Don't return password by default on queries
        },
        role: {
            type: String,
            enum: ["Student", "Admin", "ERO", "Company"],
            default: "Student",
        },
        phoneNumber: {
            type: String,
            required: false,
            trim: true,
        },
        academic: {
            type: academicSchema,
        },
        certifications: {
            type: [certificationSchema], // Array of certification subdocuments
            default: [], // Default to an empty array if no certifications are provided
        },
        username: {
            // username for users except students
            type: String,
            minlength: [2, "Username must be at least 2 characters long"],
            unique: true,
            sparse: true,
            trim: true,
        },
        // Company-specific fields (example, for company role's main contact)
        companyId: String, // Link to actual Company model
        companyName: String,
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
