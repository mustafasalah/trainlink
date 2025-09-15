import mongoose from "mongoose";

// Sub-schema for the 'agreement' field
const agreementSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        period: {
            type: String,
            required: true,
            trim: true,
        },
        renewal_type: {
            type: String,
            required: true,
            trim: true,
        },
        nature: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false } // No separate _id for subdocuments
);

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
        industry: {
            type: String,
            required: false,
            trim: true,
        },
        agreement: {
            type: agreementSchema,
            required: false, // The agreement field might not always be present
        },
    },
    {
        timestamps: true,
    }
);

// Add a pre-remove hook to delete the owner user when a company is deleted
companySchema.pre(
    "deleteOne",
    { document: true, query: false },
    async function (next) {
        try {
            // Find and delete the user whose companyId field matches this company's _id
            await mongoose.models.User.deleteOne({
                companyId: this._id.toString(),
            });
            next();
        } catch (error) {
            next(error);
        }
    }
);

const Company =
    mongoose.models.Company || mongoose.model("Company", companySchema);

export default Company;
