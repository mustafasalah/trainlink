"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "../auth";

export default function StudentsImportButton() {
    const inputRef = useRef(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handlePickFile = useCallback(() => {
        if (loading) return;
        inputRef.current?.click();
    }, [loading]);

    const handleFileChange = useCallback(
        async (event) => {
            const file = event.target.files?.[0];

            if (!file) return;

            const isExcel =
                file.name.endsWith(".xlsx") || file.name.endsWith(".xls");

            if (!isExcel) {
                alert("Please upload an Excel file (.xlsx or .xls).");
                event.target.value = "";
                return;
            }

            const yes = confirm(
                "This will update current students, add new students, and mark old students missing from the Excel file as Not Registered. Continue?",
            );

            if (!yes) {
                event.target.value = "";
                return;
            }

            const formData = new FormData();
            formData.append("file", file);

            try {
                setLoading(true);

                const res = await fetch("/api/students/import", {
                    method: "POST",
                    headers: {
                        "auth-token": await getAuthToken(),
                    },
                    body: formData,
                });

                const data = await res.json().catch(() => ({}));

                if (!res.ok) {
                    alert(data?.error || "Failed to import students.");
                    return;
                }

                const result = data.result;

                alert(
                    `Import completed successfully.\n\nCreated: ${result.created}\nUpdated: ${result.updated}\nMarked Not Registered: ${result.markedNotRegistered}\nSkipped: ${result.skipped.length}`,
                );

                router.refresh();
            } catch (err) {
                console.error(err);
                alert("Something went wrong while importing students.");
            } finally {
                setLoading(false);
                event.target.value = "";
            }
        },
        [router],
    );

    return (
        <>
            <button type="button" onClick={handlePickFile} disabled={loading}>
                {loading ? "Importing..." : "Import Excel"}
            </button>

            <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </>
    );
}
