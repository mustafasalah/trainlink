"use server";

import jwt from "jsonwebtoken";
import User from "../models/User";
import connectDB from "../DBconnection";
import { setAuthCookie } from "../auth";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET || "JKJFL958*^JJ%4LK"; // USE A STRONG, RANDOM SECRET IN PRODUCTION!
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || 60 * 60 * 24; // Token expiration time

export async function loginAction(prevState, formData) {
    const identifier = formData.get("identifier");
    const password = formData.get("password");

    if (!identifier || !password) {
        return {
            success: false,
            message: "Please provide both username/student ID and password.",
        };
    }

    await connectDB(); // Connect to the database

    try {
        let user = null;

        // Attempt to find user by username or studentId
        // Assuming 'identifier' can be either username for non-students or studentId for students
        user = await User.findOne({ username: identifier }).select("+password");

        if (!user) {
            // If not found by username, try to find by studentId
            user = await User.findOne({ studentId: identifier }).select(
                "+password"
            );
        }

        if (!user) {
            return {
                success: false,
                message: "Invalid credentials. User not found.",
                identifier,
            };
        }

        // Compare passwords
        const isMatch = await user.matchPassword(password); // Using the method defined in your UserSchema

        if (!isMatch) {
            return {
                success: false,
                message: "Invalid credentials. Password does not match.",
                identifier,
            };
        }

        // If credentials are valid, create a JWT token
        const payload = {
            id: user._id.toString(), // Convert ObjectId to string
            role: user.role,
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            profileImage: user.profileImage,
            about: user.about,

            // Include identifier relevant to the user type
            loginIdentifier:
                user.role === "Student" ? user.studentId : user.username,
            // Add other relevant data to the payload based on user role
            ...(user.role === "Student" && {
                studentId: user.studentId,
                specialization: user.specialization,
                academic: user.academic,
                certifications: user.certifications,
            }),
            ...(user.role === "Company" &&
                user.companyId && {
                    companyId: user.companyId.toString(),
                    companyName: user.companyName,
                }),
        };

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        await setAuthCookie(token, +JWT_EXPIRES_IN);
    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            message: "An error occurred during login. Please try again later.",
        };
    }

    return redirect("/");
}
