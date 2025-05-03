import users from "@/app/DB/users";

export async function GET(request, { params }) {
    // Get User Details
    const userId = await params.id;
    const user = users.find(({ id }) => id == userId);

    if (user) {
        return new Response(JSON.stringify(user), {
            status: 200,
            headers: {
                contentType: "application/json",
            },
        });
    }

    return new Response(`404 - There are no user with this id: ${userId}`, {
        status: 404,
        headers: {
            contentType: "application/json",
        },
    });
}
