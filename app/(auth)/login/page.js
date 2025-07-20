"use client";

import { loginAction } from "@/app/actions/authActions";
import React, { useActionState } from "react";

export default function page() {
    const [state, formAction, pending] = useActionState(loginAction, {
        message: "",
    });

    return (
        <div className="body-login">
            <div className="container">
                <div className="title-login">
                    <h3>Start Your Journey !</h3>
                    <h1>Sign In to TrainLink</h1>
                </div>
                <form action={formAction} className="login-form">
                    {!state.success ? (
                        <p style={{ color: "red" }}>{state.message}</p>
                    ) : (
                        ""
                    )}
                    <div className="input-box">
                        <label htmlFor="login-email">
                            Identifier (username/student No)
                        </label>
                        <i className="icon-mail"></i>
                        <input
                            type="text"
                            className="input-field"
                            id="login-email"
                            name="identifier"
                            placeholder="username/student no"
                        />
                    </div>
                    <div className="input-box">
                        <label htmlFor="login-pass">Password</label>
                        <i className="icon-lock"></i>
                        <input
                            type="password"
                            className="input-field"
                            name="password"
                            id="login-pass"
                        />
                    </div>
                    <div className="input-box">
                        <button
                            className="btn-submit"
                            id="SignInBtn"
                            type="submit"
                            disabled={pending}
                        >
                            Login <i className="icon-log-in"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
