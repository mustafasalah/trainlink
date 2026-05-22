import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import connectDB from "@/app/DBconnection";
import User from "@/app/models/User";
import { getAuthUser } from "@/app/auth";

export const runtime = "nodejs";

function normalizeHeader(value = "") {
    return value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/_/g, "")
        .replace(/-/g, "");
}

function getCell(row, aliases = []) {
    const keys = Object.keys(row || {});

    for (const alias of aliases) {
        const normalizedAlias = normalizeHeader(alias);
        const matchedKey = keys.find(
            (key) => normalizeHeader(key) === normalizedAlias,
        );

        if (matchedKey) {
            return row[matchedKey];
        }
    }

    return "";
}

function toText(value) {
    if (value === null || value === undefined) return "";
    return value.toString().trim();
}

function toNumberOrUndefined(value) {
    const text = toText(value);
    if (!text) return undefined;

    const number = Number(text);
    return Number.isNaN(number) ? undefined : number;
}

export async function POST(request) {
    const loggedUser = await getAuthUser(true);

    if (!loggedUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (loggedUser.role !== "Admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File) || file.size === 0) {
            return NextResponse.json(
                { error: "Excel file is required." },
                { status: 400 },
            );
        }

        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
        ];

        const fileName = file.name || "";
        const isExcelName =
            fileName.endsWith(".xlsx") || fileName.endsWith(".xls");

        if (!allowedTypes.includes(file.type) && !isExcelName) {
            return NextResponse.json(
                { error: "Only Excel files are allowed." },
                { status: 400 },
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const workbook = XLSX.read(buffer, { type: "buffer" });
        const firstSheetName = workbook.SheetNames[0];

        if (!firstSheetName) {
            return NextResponse.json(
                { error: "Excel file has no sheets." },
                { status: 400 },
            );
        }

        const worksheet = workbook.Sheets[firstSheetName];

        const rows = XLSX.utils.sheet_to_json(worksheet, {
            defval: "",
        });

        if (!rows.length) {
            return NextResponse.json(
                { error: "Excel file is empty." },
                { status: 400 },
            );
        }

        const idsInExcel = new Set();

        const result = {
            totalRows: rows.length,
            created: 0,
            updated: 0,
            markedNotRegistered: 0,
            skipped: [],
        };

        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            const rowNumber = index + 2;

            const studentId = toText(
                getCell(row, ["studentId", "student id", "student_id", "id"]),
            );

            const fullName = toText(
                getCell(row, ["fullName", "full name", "name", "studentName"]),
            );

            const email = toText(
                getCell(row, ["email", "emailAddress"]),
            ).toLowerCase();

            const phoneNumber = toText(
                getCell(row, [
                    "phoneNumber",
                    "phone",
                    "mobile",
                    "phone number",
                ]),
            );

            const specialization = toText(
                getCell(row, ["specialization", "major"]),
            );

            const department = toText(
                getCell(row, ["department", "majorDepartment"]),
            );

            const college = toText(
                getCell(row, ["college", "faculty", "school"]),
            );

            const year = toText(
                getCell(row, ["year", "studyYear", "academicYear"]),
            );

            const gpa = toNumberOrUndefined(getCell(row, ["gpa", "GPA"]));

            const skills = toText(
                getCell(row, ["skills", "interests", "relevantSkills"]),
            );

            if (!studentId) {
                result.skipped.push({
                    row: rowNumber,
                    reason: "Missing studentId.",
                });
                continue;
            }

            idsInExcel.add(studentId);

            try {
                const existingStudent = await User.findOne({
                    role: "Student",
                    studentId,
                });

                if (existingStudent) {
                    const nextFullName = fullName || existingStudent.fullName;
                    const nextEmail = email || existingStudent.email;

                    const nextAcademic = {
                        department:
                            department ||
                            existingStudent.academic?.department ||
                            "",
                        college:
                            college || existingStudent.academic?.college || "",
                        year: year || existingStudent.academic?.year || "",
                        gpa:
                            gpa !== undefined
                                ? gpa
                                : existingStudent.academic?.gpa,
                        skills:
                            skills !== ""
                                ? skills
                                : existingStudent.academic?.skills || "",
                        registered: true,
                    };

                    if (!nextFullName || !nextEmail) {
                        result.skipped.push({
                            row: rowNumber,
                            studentId,
                            reason: "Missing fullName or email.",
                        });
                        continue;
                    }

                    if (
                        !nextAcademic.department ||
                        !nextAcademic.college ||
                        !nextAcademic.year
                    ) {
                        result.skipped.push({
                            row: rowNumber,
                            studentId,
                            reason: "Missing academic required fields: department, college, or year.",
                        });
                        continue;
                    }

                    existingStudent.fullName = nextFullName;
                    existingStudent.email = nextEmail;
                    existingStudent.phoneNumber = phoneNumber;
                    existingStudent.specialization = specialization;
                    existingStudent.academic = nextAcademic;

                    await existingStudent.save();

                    result.updated++;
                } else {
                    if (
                        !fullName ||
                        !email ||
                        !department ||
                        !college ||
                        !year
                    ) {
                        result.skipped.push({
                            row: rowNumber,
                            studentId,
                            reason: "New student requires fullName, email, department, college, and year.",
                        });
                        continue;
                    }

                    const defaultPassword =
                        process.env.DEFAULT_STUDENT_PASSWORD || `123456`;

                    await User.create({
                        fullName,
                        email,
                        password: defaultPassword,
                        role: "Student",
                        studentId,
                        phoneNumber,
                        specialization,
                        academic: {
                            department,
                            college,
                            year,
                            gpa,
                            skills,
                            registered: true,
                        },
                        certifications: [],
                    });

                    result.created++;
                }
            } catch (err) {
                console.error("Student import row failed:", err);

                let reason = "Failed to process this row.";

                if (err?.code === 11000) {
                    const fields = Object.keys(err.keyPattern || {});
                    reason = `Duplicate value for: ${fields.join(", ")}`;
                }

                result.skipped.push({
                    row: rowNumber,
                    studentId,
                    reason,
                });
            }
        }

        const idsArray = Array.from(idsInExcel);

        if (idsArray.length > 0) {
            const unregisterResult = await User.updateMany(
                {
                    role: "Student",
                    studentId: { $nin: idsArray },
                },
                {
                    $set: {
                        "academic.registered": false,
                    },
                },
            );

            result.markedNotRegistered = unregisterResult.modifiedCount || 0;
        }

        return NextResponse.json(
            {
                ok: true,
                message: "Students imported successfully.",
                result,
            },
            { status: 200 },
        );
    } catch (err) {
        console.error("Students import error:", err);

        return NextResponse.json(
            { error: "Failed to import students file." },
            { status: 500 },
        );
    }
}
