import React from "react";
import Link from "next/link";
import ToggleStudentStatusButton from "./ToggleStudentStatusButton";

function getRegisteredStatus(student) {
    return student?.academic?.registered ? "Registered" : "Not Registered";
}

export default function StudentsTable({ students = [] }) {
    return (
        <div className="apps-form">
            <table>
                <thead>
                    <tr>
                        <td>Student</td>
                        <td>Student ID</td>
                        <td>Phone</td>
                        <td>Department</td>
                        <td>College</td>
                        <td>Year</td>
                        <td>GPA</td>
                        <td>Status</td>
                        <td>Action</td>
                    </tr>
                </thead>

                <tbody>
                    {students.length === 0 ? (
                        <tr>
                            <td colSpan="10">No students found.</td>
                        </tr>
                    ) : (
                        students.map((student) => {
                            const registered = Boolean(
                                student.academic?.registered,
                            );

                            return (
                                <tr key={student._id}>
                                    <td>
                                        <Link href={`/users/${student._id}`}>
                                            {student.fullName}
                                        </Link>

                                        {student.specialization ? (
                                            <small
                                                style={{
                                                    display: "block",
                                                    color: "#777",
                                                    marginTop: "3px",
                                                }}
                                            >
                                                {student.specialization}
                                            </small>
                                        ) : (
                                            ""
                                        )}
                                    </td>

                                    <td>{student.studentId || "-"}</td>

                                    <td>{student.phoneNumber || "-"}</td>

                                    <td>
                                        {student.academic?.department || "-"}
                                    </td>

                                    <td>{student.academic?.college || "-"}</td>

                                    <td>{student.academic?.year || "-"}</td>

                                    <td>{student.academic?.gpa ?? "-"}</td>

                                    <td>
                                        <span
                                            style={{
                                                color: registered
                                                    ? "green"
                                                    : "red",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {getRegisteredStatus(student)}
                                        </span>
                                    </td>

                                    <td>
                                        <Link href={`/users/${student._id}`}>
                                            View Profile
                                        </Link>

                                        <br />

                                        <ToggleStudentStatusButton
                                            studentId={student._id}
                                            registered={registered}
                                        />
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
