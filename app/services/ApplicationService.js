"use server";

import connectDB from "../DBconnection";

import Internship from "../models/Internship";
import Application from "../models/Application";
import Job from "../models/Job";
import { addPeriodToDate } from "../functions";

/**
 * 1. Accepts a student application by an admin.
 * @param {string} applicationId - The _id of the application to accept.
 * @returns {Promise<object>} The updated application document.
 */
export async function acceptApplicationByAdmin(applicationId) {
    await connectDB();

    try {
        const application = await Application.findByIdAndUpdate(
            applicationId,
            { acceptedByAdmin: true, notes: "" },
            { new: true, runValidators: true }
        );

        if (!application) {
            throw "Application not found.";
        }

        return application.toObject();
    } catch (error) {
        console.error("Error accepting application by admin:", error);
        throw "Failed to accept application by admin.";
    }
}

/**
 * 2. Rejects a student application by an admin.
 * @param {string} applicationId - The _id of the application to reject.
 * @param {string} rejectionReason - The reason for rejection to be saved in the notes.
 * @returns {Promise<object>} The updated application document.
 */
export async function rejectApplicationByAdmin(applicationId, rejectionReason) {
    await connectDB();

    try {
        const application = await Application.findByIdAndUpdate(
            applicationId,
            {
                status: "Rejected",
                notes: `Admin rejected: ${rejectionReason}`,
            },
            { new: true, runValidators: true }
        );

        if (!application) {
            throw "Application not found.";
        }

        return application.toObject();
    } catch (error) {
        console.error("Error rejecting application by admin:", error);
        throw "Failed to reject application by admin.";
    }
}

/**
 * 3. Accepts a student application by a company, updates status, and creates an internship.
 * @param {string} applicationId - The _id of the application to accept.
 * @param {object} internshipDetails - An object containing startDate and endDate for the internship.
 * @returns {Promise<object>} The newly created internship document.
 */
export async function acceptApplicationByCompany(applicationId) {
    await connectDB();

    try {
        // Find the application and populate the job to get the company ID
        const application = await Application.findById(applicationId).populate(
            "job"
        );

        if (!application) {
            throw "Application not found.";
        }

        if (application.status !== "Pending") {
            throw (
                "Application status is already " +
                application.status +
                ". Cannot accept."
            );
        }

        // Ensure the application has been accepted by an admin first (if that's a business rule)
        if (!application.acceptedByAdmin) {
            throw "Application has not been accepted by an admin yet.";
        }

        // Clear the application notes
        application.notes = "";

        // Update the application status to 'Accepted'
        application.status = "Accepted";
        await application.save();

        // Get the companyId from the populated job document
        const companyId = application.job.companyId;

        // Create a new internship document
        const newInternship = new Internship({
            application: application._id,
            student: application.student,
            company: companyId,
            startDate: application.job.deadline,
            endDate: addPeriodToDate(
                application.job.deadline,
                application.job.period
            ),
            status: "Ongoing",
        });

        await newInternship.save();

        return newInternship.toObject();
    } catch (error) {
        console.error("Error accepting application by company:", error);
        throw "Failed to accept application and create internship.";
    }
}

/**
 * 4. Rejects a student application by a company.
 * @param {string} applicationId - The _id of the application to reject.
 * @param {string} rejectionReason - The reason for rejection to be saved in the notes.
 * @returns {Promise<object>} The updated application document.
 */
export async function rejectApplicationByCompany(
    applicationId,
    rejectionReason
) {
    await connectDB();

    try {
        const application = await Application.findByIdAndUpdate(
            applicationId,
            {
                status: "Rejected",
                notes: `Company rejected: ${rejectionReason}`,
            },
            { new: true, runValidators: true }
        );

        if (!application) {
            throw "Application not found.";
        }

        return application.toObject();
    } catch (error) {
        console.error("Error rejecting application by company:", error);
        throw "Failed to reject application by company.";
    }
}
