import { getAuthUser } from "@/app/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function layout({ children }) {
    const loggedUser = await getAuthUser();

    if (loggedUser) return redirect("/");

    return <div>{children}</div>;
}
