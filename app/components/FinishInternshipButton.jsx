"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function FinishInternshipButton({ applicationId, callback }) {
    const router = useRouter();

    const onFinish = useCallback(async () => {
        const yes = confirm("Finish this internship for this student?");
        if (!yes) return;

        try {
            const res = await fetch("/api/internships/finish", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ applicationId }),
            });

            if (!res.ok) {
                let msg = "Failed to finish internship.";
                try {
                    const data = await res.json();
                    if (data?.error) msg = data.error;
                } catch (_) {}
                alert(msg);
                return;
            }

            alert("Internship finished successfully.");
            router.refresh();
            callback && callback();
        } catch (e) {
            console.error(e);
            alert("Something went wrong.");
        }
    }, [applicationId, router]);

    return (
        <button
            type="button"
            onClick={onFinish}
            style={{
                background: "#0f766e",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                width: "100%",
            }}
        >
            Finish this Internship for this student
        </button>
    );
}
