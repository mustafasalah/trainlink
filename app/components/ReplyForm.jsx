"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import useLoggedUser from "../hooks/useLoggedUser";

export default function ReplyForm({ topicId }) {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const loggedUser = useLoggedUser();
    const router = useRouter();

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            if (!loggedUser || !loggedUser.id) {
                alert("You must be logged in to reply.");
                return;
            }

            const trimmed = message.trim();
            if (!trimmed) {
                alert("Please write a reply message.");
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(
                    `/api/forum/topics/${topicId}/replies`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            message: trimmed,
                            authorId: loggedUser.id,
                            authorName:
                                loggedUser.fullName ||
                                loggedUser.username ||
                                "Unknown",
                        }),
                    }
                );

                if (!res.ok) {
                    let msg = "Failed to post reply.";
                    try {
                        const data = await res.json();
                        if (data.error) msg = data.error;
                    } catch (_) {}
                    alert(msg);
                    return;
                }

                setMessage("");
                router.refresh();
            } catch (err) {
                console.error(err);
                alert("Something went wrong while posting reply.");
            } finally {
                setLoading(false);
            }
        },
        [loggedUser, message, router, topicId]
    );

    return (
        <form className="add-reply-box" onSubmit={handleSubmit}>
            <h5>Reply</h5>
            <textarea
                placeholder="Write your reply ..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" disabled={loading}>
                {loading ? "Posting..." : "Post"}
            </button>
        </form>
    );
}
