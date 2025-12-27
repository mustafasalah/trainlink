"use client";

import React from "react";
import useLoggedUser from "../hooks/useLoggedUser";

export default function Header() {
    const loggedUser = useLoggedUser();
    return (
        <div className="head">
            <h3>
                <strong>Welcome</strong>, {loggedUser.fullName}
            </h3>
        </div>
    );
}
