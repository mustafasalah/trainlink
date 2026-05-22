"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function ToggleStudentStatusButton({ studentId, registered }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleToggle = useCallback(async () => {
        const nextStatus = registered ? "Not Registered" : "Registered";

        const yes = confirm(
            `Are you sure you want to change this student status to "${nextStatus}"?`,
        );

        if (!yes) return;

        try {
            setLoading(true);

            const res = await fetch(
                `/api/students/${studentId}/toggle-status`,
                {
                    method: "PATCH",
                },
            );

            if (!res.ok) {
                let message = "Failed to update student status.";

                try {
                    const data = await res.json();
                    if (data?.error) message = data.error;
                } catch (_) {}

                alert(message);
                return;
            }

            alert("Student status updated successfully.");
            router.refresh();
        } catch (err) {
            console.error(err);
            alert("Something went wrong while updating student status.");
        } finally {
            setLoading(false);
        }
    }, [studentId, registered, router]);

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={loading}
            style={{
                background: registered ? "#dc2626" : "#16a34a",
                color: "white",
                border: "none",
                padding: "6px 10px",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "12px",
                marginTop: "6px",
            }}
        >
            {loading
                ? "Updating..."
                : registered
                  ? "Set Not Registered"
                  : "Set Registered"}
        </button>
    );
}
