import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        thumbnailUrl: {
            type: String,
            required: false,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        about: {
            type: String,
            required: false,
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: false,
            trim: true,
        },
        email: {
            type: String,
            required: false,
            unique: true,
            trim: true,
            lowercase: true,
        },
        website: {
            type: String,
            required: false,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Company =
    mongoose.models.Company || mongoose.model("Company", companySchema);

export default Company;
