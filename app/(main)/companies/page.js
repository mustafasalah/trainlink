import React from "react";
import Card from "../../components/Card";

export const dynamic = "force-dynamic";

export default async function Companies() {
    const data = await fetch("https://trainlink.fly.dev/api/companies");
    const compaines = await data.json();

    return (
        <div className="content">
            <div className="companies">
                <h3>
                    Companies<span>({compaines.length})</span>
                </h3>
                <div className="companies-cards">
                    {compaines.map(
                        ({ _id, thumbnailUrl, name, description }) => (
                            <Card
                                key={_id}
                                url={`/companies/${_id}`}
                                thumbnailUrl={thumbnailUrl}
                                title={name}
                                description={description}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
