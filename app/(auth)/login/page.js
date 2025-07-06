"use client";

import { loginAction } from "@/app/actions/authActions";
import React, { useActionState } from "react";

export default function page() {
    const [state, formAction, pending] = useActionState(loginAction, {
        message: "",
    });

    return (
        <div class="body-login">
            <div class="container">
                <div class="title-login">
                    <h3>Start Your Journey !</h3>
                    <h1>Sign In to TrainLink</h1>
                </div>
                <form action={formAction} class="login-form">
                    {!state.success ? (
                        <p style={{ color: "red" }}>{state.message}</p>
                    ) : (
                        ""
                    )}
                    <div class="input-box">
                        <label for="login-email">
                            Identifier (username/student No)
                        </label>
                        <i class="icon-mail"></i>
                        <input
                            type="text"
                            class="input-field"
                            id="login-email"
                            name="identifier"
                            placeholder="username/student no"
                        />
                    </div>
                    <div class="input-box">
                        <label for="login-pass">Password</label>
                        <i class="icon-lock"></i>
                        <input
                            type="password"
                            class="input-field"
                            name="password"
                            id="login-pass"
                        />
                    </div>
                    <div class="input-box">
                        <button
                            class="btn-submit"
                            id="SignInBtn"
                            type="submit"
                            disabled={pending}
                        >
                            Login <i class="icon-log-in"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
