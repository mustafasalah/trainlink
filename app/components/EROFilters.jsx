"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function EROFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentQ = searchParams.get("q") || "";

    const [query, setQuery] = useState(currentQ);
    const [isSearching, setIsSearching] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setQuery(currentQ);
    }, [currentQ]);

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (trimmedQuery === currentQ) {
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (trimmedQuery) {
                params.set("q", trimmedQuery);
            } else {
                params.delete("q");
            }

            const url = params.toString()
                ? `${pathname}?${params.toString()}`
                : pathname;

            startTransition(() => {
                router.replace(url, { scroll: false });
            });
        }, 450);

        return () => clearTimeout(timer);
    }, [query, currentQ, pathname, router, searchParams]);

    useEffect(() => {
        if (query.trim() === currentQ && !isPending) {
            setIsSearching(false);
        }
    }, [query, currentQ, isPending]);

    const showLoading = isSearching || isPending;

    return (
        <div className="apps-search-form">
            <div className="app-search-status">
                <div className="search-box" style={{ position: "relative" }}>
                    <input
                        type="search"
                        placeholder="Search by name, email, username, phone..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    {showLoading ? (
                        <span
                            style={{
                                position: "absolute",
                                right: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                fontSize: "12px",
                                color: "#777",
                            }}
                        >
                            Searching...
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );
}