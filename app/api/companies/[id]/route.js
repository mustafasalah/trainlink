import compaines from "@/app/DB/compaines";

export async function GET(request, { params }) {
    // Get Compaine Details
    const companyId = await params.id;
    const company = compaines.find(({ id }) => id == companyId);

    if (company) {
        return new Response(JSON.stringify(company), {
            status: 200,
            headers: {
                contentType: "application/json",
            },
        });
    }

    return new Response(
        `404 - There are no company with this id: ${companyId}`,
        {
            status: 404,
            headers: {
                contentType: "application/json",
            },
        }
    );
}
