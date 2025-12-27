"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ApplicationsFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const q = searchParams.get("q") || "";

    function updateSearch(value) {
        const params = new URLSearchParams(searchParams.toString());

        if (!value) {
            params.delete("q");
        } else {
            params.set("q", value);
        }

        router.push(`/applications?${params.toString()}`);
    }

    return (
        <div className="apps-search-form">
            <div className="app-search-status">
                <div className="search-box">
                    <input
                        type="search"
                        placeholder="Search by opportunity name"
                        defaultValue={q}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                updateSearch(e.currentTarget.value.trim());
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
