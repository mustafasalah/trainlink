"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "timeago.js";

export default function ReplyItem({ reply, canDelete }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = useCallback(async () => {
        const yes = confirm("Are you sure you want to delete this reply?");
        if (!yes) return;

        try {
            setLoading(true);
            const res = await fetch(`/api/replies/${reply._id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                let msg = "Failed to delete reply.";
                try {
                    const data = await res.json();
                    if (data?.error) msg = data.error;
                } catch (_) {}
                alert(msg);
                return;
            }

            router.refresh();
        } catch (e) {
            console.error(e);
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, [reply._id, router]);

    return (
        <div className="reply-box">
            <img src={reply.authorAvatar} alt="" />
            <div className="box">
                <div
                    className="name-time-disc"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                    }}
                >
                    <div>
                        <span>{reply.authorName}</span>
                        <p>{format(reply.createdAt)}</p>
                    </div>

                    {canDelete ? (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            style={{
                                background: "#dc2626",
                                color: "white",
                                border: "none",
                                padding: "6px 10px",
                                borderRadius: 6,
                                cursor: loading ? "not-allowed" : "pointer",
                                height: "fit-content",
                            }}
                            title="Delete reply"
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </button>
                    ) : null}
                </div>

                <div className="disc-box">
                    <p>{reply.message}</p>
                </div>
            </div>
        </div>
    );
}
