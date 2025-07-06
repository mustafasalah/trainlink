import React from "react";
import Card from "./Card";
import { getAuthUser } from "../auth";

export default async function CompaniesView({ companies }) {
    const loggedUser = await getAuthUser();

    return (
        <div className="companies">
            <h3>
                {loggedUser.role === "ERO" ? "Contracted" : ""} Companies
                <span>({companies.length})</span>
            </h3>
            <div className="companies-cards">
                {companies.map(({ _id, thumbnailUrl, name, description }) => (
                    <Card
                        key={_id}
                        url={`/companies/${_id}`}
                        thumbnailUrl={thumbnailUrl}
                        title={name}
                        description={description}
                        editable={loggedUser.role === "ERO"}
                    />
                ))}
            </div>
        </div>
    );
}
