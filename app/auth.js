"use server";

import { cookies } from "next/headers"; // Next.js utility to access cookies on the server
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "JKJFL958*^JJ%4LK"; // Must match the secret used for signing
const JWT_COOKIE_NAME = "authToken"; // Must match the cookie name used on the client side (utils/auth.js)

/**
 * Verifies the JWT token stored in an HttpOnly cookie on the server side.
 * @returns {object | null} The decoded JWT payload if valid, otherwise null.
 */
export async function verifyAuthToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_COOKIE_NAME)?.value;

    if (!token) {
        return null;
    }

    try {
        // Verify the token using the secret. This also checks expiration.
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded; // Returns the payload
    } catch (error) {
        console.error("Server-side JWT verification failed:", error);
        // Optionally, clear the invalid cookie here if verification fails
        cookieStore.delete(JWT_COOKIE_NAME);
        return null;
    }
}

/**
 * Retrieves the authenticated user's data from the verified JWT token.
 * This is a convenience function that calls verifyAuthToken.
 * @returns {object | null} The authenticated user's data (payload) or null if not authenticated.
 */
export async function getAuthUser() {
    return await verifyAuthToken();
}

/**
 * Sets an HttpOnly JWT cookie on the server after successful login.
 * This function should be called from a Server Action or API Route.
 * @param {string} token The JWT token to set.
 * @param {number} maxAgeSeconds The maximum age of the cookie in seconds (e.g., 60 * 60 * 24 * 7 for 7 days).
 */
export async function setAuthCookie(token, maxAgeSeconds = 60 * 60 * 24) {
    const cookieStore = await cookies();
    cookieStore.set({
        name: JWT_COOKIE_NAME,
        value: token,
        httpOnly: true, // Crucial for security: prevents client-side JS access
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
        sameSite: "Lax", // Protects against CSRF attacks
        maxAge: maxAgeSeconds, // Cookie expiration time
        path: "/", // Cookie is valid for all paths
    });
}

/**
 * Clears the HttpOnly JWT cookie on the server side for logout.
 * This function should be called from a Server Action or API Route.
 */
export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(JWT_COOKIE_NAME);
}
