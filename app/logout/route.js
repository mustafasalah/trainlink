import { redirect } from "next/navigation";
import { clearAuthCookie } from "../auth";

export async function GET(request) {
    await clearAuthCookie();
    return redirect("/login");
}
