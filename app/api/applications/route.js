import applications from "@/app/DB/applications";

export async function GET(request) {
    return new Response(JSON.stringify(applications), {
        status: 200,
        headers: {
            contentType: "application/json",
        },
    });
}
