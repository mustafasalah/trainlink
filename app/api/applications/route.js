import applications from "@/app/DB/applications";

export async function GET(request) {
    // return console.log(JSON.stringify(applications));
    return new Response(JSON.stringify(applications), {
        status: 200,
        headers: {
            contentType: "application/json",
        },
    });
}
