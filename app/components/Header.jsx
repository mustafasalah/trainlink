import React from "react";

export default function Header() {
    return (
        <div className="head">
            <div className="search">
                <input
                    type="search"
                    placeholder="What do you want to interns?"
                />
            </div>
            <div className="icons">
                <i className="icon-languages"></i>
                <i className="icon-sun-moon"></i>
                <i className="icon-bell"></i>
            </div>
        </div>
    );
}
