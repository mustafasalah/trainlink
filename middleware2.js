import { NextResponse } from "next/server";
import { getAuthUser } from "./app/auth";

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const loggedUser = await getAuthUser();

    // If the path is '/login'
    if (pathname === "/login") {
        if (loggedUser) return NextResponse.redirect("/");
        console.log("Wok");
        return NextResponse.next();
    }

    // If the user is authenticated, continue as normal
    if (loggedUser) {
        return NextResponse.next();
    }

    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
    matcher: "/((?!api|_next/static|_next/image|.*\\.png$).*)",
};
