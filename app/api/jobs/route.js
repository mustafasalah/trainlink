import { getAuthUser } from "@/app/auth";
import connectDB from "@/app/DBconnection";
import Job from "@/app/models/Job";

export async function GET(request) {
    let loggedUser = await getAuthUser(true);

    if (!loggedUser) return new Response("[]", { status: 401 });

    // Make a database connection
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    let companyId = searchParams.get("companyId") ?? loggedUser?.companyId;

    let data = [];
    if (companyId) {
        data = await Job.find({ companyId: companyId });
    } else {
        if (loggedUser.role === "Student")
            data = await Job.find({ status: "active" });
        else {
            datat = await Jo.find();
        }
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            contentType: "application/json",
        },
    });
}
