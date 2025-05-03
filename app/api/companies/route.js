import compaines from "@/app/DB/compaines";

export async function GET(request) {
    return new Response(JSON.stringify(compaines), {
        status: 200,
        headers: {
            contentType: "application/json",
        },
    });
}
