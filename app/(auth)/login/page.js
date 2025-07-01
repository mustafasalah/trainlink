"use client";

import { loginAction } from "@/app/actions/loginAction";
import { getAuthUser } from "@/app/auth";
import { useRouter } from "next/navigation";
import React, { useActionState } from "react";

export default function page() {
    const [state, formAction, pending] = useActionState(loginAction, {
        message: "",
    });

    return (
        <div>
            <h2>Login Page</h2>
            <form action={formAction}>
                {!state.success ? (
                    <p style={{ color: "red" }}>{state.message}</p>
                ) : (
                    ""
                )}
                <input type="text" name="identifier" />
                <input type="password" name="password" />
                <button type="submit" disabled={pending}>
                    Login
                </button>
            </form>
        </div>
    );
}
