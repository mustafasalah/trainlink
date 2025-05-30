import applications from "@/app/DB/applications";

export async function GET(request) {
    return new Response(JSON.stringify(applications), {
        status: 200,
        headers: {
            contentType: "application/json",
        },
    });
}

export async function POST(request) {
    const req = await request.json();

    applications.push({
        id: 2,
        title: req.title,
        status: "pending",
        datetime: new Date().toISOString().replace("T", " ").slice(0, -5),
    });

    return new Response("Done", {
        status: 200,
        headers: {
            contentType: "application/json",
        },
    });
}
