import React from "react";
import { redirect } from "next/navigation";
import { getAuthToken, getAuthUser } from "@/app/auth";
import StudentsTable from "@/app/components/StudentsTable";
import StudentsFilters from "@/app/components/StudentsFilters";
import StudentsImportButton from "@/app/components/StudentsImportButton";

export const dynamic = "force-dynamic";

export default async function StudentsPage({ searchParams }) {
    const loggedUser = await getAuthUser();

    if (!loggedUser || loggedUser.role !== "Admin") {
        redirect("/");
    }

    const params = await searchParams;
    const q = (params?.q || "").trim();

    const qs = new URLSearchParams();
    if (q) qs.set("q", q);

    const data = await fetch(
        `http://localhost:3000/api/students?${qs.toString()}`,
        {
            headers: {
                "auth-token": await getAuthToken(),
            },
            cache: "no-store",
        },
    );

    const students = await data.json();

    return (
        <div className="content">
            <div className="applications">
                <div
                    className="head-title"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <h3>
                        Students <span>({students.length})</span>
                    </h3>

                    <div className="buttons">
                        <StudentsImportButton />
                    </div>
                </div>

                <StudentsFilters />

                <StudentsTable students={students} />
            </div>
        </div>
    );
}
