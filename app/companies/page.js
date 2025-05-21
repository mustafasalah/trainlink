import React from "react";
import Card from "../components/Card";

export default async function Companies() {
    const data = await fetch("http://localhost:3000/api/companies");
    const compaines = await data.json();

    return (
        <div className="content">
            <div className="companies">
                <h3>
                    Companies<span>(12)</span>
                </h3>
                <div className="companies-cards">
                    {compaines.map(
                        ({ id, thumbnailUrl, name, description }) => (
                            <Card
                                key={id}
                                url={`/companies/${id}`}
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
