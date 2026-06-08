"use client";

import { loginAction } from "@/app/actions/authActions";
import React, { useActionState } from "react";

export default function LoginPage() {
    const [state, formAction, pending] = useActionState(loginAction, {
        message: "",
    });

    return (
        <div className="body-login">
            <div className="login-layout">
                <div className="login-info">
                    <div className="login-brand">
                        <div className="brand-icon">
                            <i className="icon-graduation-cap"></i>
                        </div>
                        <h2>TrainLink</h2>
                    </div>

                    <h1>SUST Training Management Platform</h1>

                    <p>
                        Connect students, companies, and university
                        administration through a clear and organized internship
                        process.
                    </p>

                    <ul>
                        <li>Apply for internship opportunities</li>
                        <li>Track applications and training progress</li>
                        <li>Manage companies, students, and approvals</li>
                    </ul>
                </div>

                <div className="container">
                    <div className="title-login">
                        <span>Start Your Journey</span>
                        <h1>Sign In to TrainLink</h1>
                        <p>Enter your account identifier to continue.</p>
                    </div>

                    <form action={formAction} className="login-form">
                        {!state.success && state.message ? (
                            <div className="login-error">
                                <i className="icon-circle-alert"></i>
                                <span>{state.message}</span>
                            </div>
                        ) : (
                            ""
                        )}

                        <div className="input-box">
                            <label htmlFor="login-email">Identifier</label>

                            <div className="input-control">
                                <i className="icon-mail"></i>
                                <input
                                    type="text"
                                    className="input-field"
                                    id="login-email"
                                    name="identifier"
                                    placeholder="Username or Student No"
                                    autoComplete="username"
                                    required
                                />
                            </div>

                            <small>Use your username or student number.</small>
                        </div>

                        <div className="input-box">
                            <label htmlFor="login-pass">Password</label>

                            <div className="input-control">
                                <i className="icon-lock"></i>
                                <input
                                    type="password"
                                    className="input-field"
                                    name="password"
                                    id="login-pass"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-box">
                            <button
                                className="btn-submit"
                                id="SignInBtn"
                                type="submit"
                                disabled={pending}
                            >
                                {pending ? "Signing in..." : "Login"}
                                <i className="icon-log-in"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
