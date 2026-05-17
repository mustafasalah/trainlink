import mongoose from "mongoose";
import User from "../User.js";
import Company from "../Company.js";

const MONGODB_URI =
    "mongodb://rashasalah:hKn6KpnYdOc1PBsm@main.rswj1dj.mongodb.net/trainlink?appName=Main";

if (!MONGODB_URI) {
    throw new Error("Please set MONGODB_URI in your environment.");
}

async function seedDemoUsers() {
    await mongoose.connect(MONGODB_URI);

    try {
        // Clean old demo data
        await User.deleteMany({
            email: {
                $in: [
                    "student.demo@trainlink.com",
                    "admin.demo@trainlink.com",
                    "ero.demo@trainlink.com",
                    "company.demo@trainlink.com",
                ],
            },
        });

        await Company.deleteMany({
            name: "Demo Tech Company",
        });

        // 1) Create company first
        const company = await Company.create({
            thumbnailUrl: "https://placehold.co/300x300?text=Demo+Tech",
            name: "Zain Sudan",
            about: "Demo company account for testing company workflows.",
            phoneNumber: "+249900000010",
            email: "info@demotech.com",
            website: "https://sd.zain.com",
            industry: "Telecom",
            agreement: {
                date: new Date("2026-04-01"),
                period: "1 year",
                renewal_type: "Automatic",
                nature: "Internship Partnership",
            },
        });

        // 2) Create 4 users with different roles
        const users = [
            {
                fullName: "Rasha Salah",
                specialization: "UI/UX Designer",
                studentId: "20181010",
                about: "Fresh Student that love Designing Web and Mobile Apps",
                email: "student.demo@trainlink.com",
                password: "123456",
                role: "Student",
                phoneNumber: "+249900000001",
                academic: {
                    department: "Software Engineering",
                    college: "Faculty of Engineering",
                    year: "4th Year",
                    gpa: 3.7,
                    skills: "React, Next.js, JavaScript, UI/UX",
                    registered: true,
                },
                certifications: [
                    {
                        title: "UI/UX Design Basics",
                        issueDate: new Date("2025-10-10"),
                        issuer: "Coursera",
                    },
                ],
            },
            {
                fullName: "Alaa",
                specialization: "System Administration",
                about: "admin account for admin features.",
                email: "admin.demo@trainlink.com",
                password: "123456",
                role: "Admin",
                phoneNumber: "+249900000002",
                username: "alaa",
            },
            {
                fullName: "Mozen",
                specialization: "Education Relations",
                about: "ERO account for ERO workflows.",
                email: "ero.demo@trainlink.com",
                password: "123456",
                role: "ERO",
                phoneNumber: "+249900000003",
                username: "mozen",
            },
            {
                fullName: "Ahmed Ali",
                specialization: "HR Coordinator",
                about: "Demo company account for testing company features.",
                email: "company.demo@trainlink.com",
                password: "123456",
                role: "Company",
                phoneNumber: "+249900000004",
                username: "zainsudan",
                companyId: company._id.toString(),
                companyName: company.name,
            },
        ];

        for (const userData of users) {
            await User.create(userData);
        }

        console.log("✅ Demo company created:", company.name);
        console.log("✅ 4 demo users created successfully.");
    } catch (error) {
        console.error("❌ Failed to seed demo users:", error);
    } finally {
        await mongoose.disconnect();
    }
}

seedDemoUsers();
