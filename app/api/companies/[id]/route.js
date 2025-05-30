import connectDB from "@/app/DBconnection";
import Company from "@/app/models/Company";

export async function GET(request, { params }) {
    // Make a database connection
    await connectDB();

    // Get Compaine Details
    const companyId = (await params).id;
    const company = await Company.findOne({ _id: companyId });

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
