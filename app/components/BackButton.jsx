"use client";
import React from "react";

export default function BackButton() {
    return (
        <button onClick={() => history.back()}>
            Back <i className="icon-chevron-right"></i>
        </button>
    );
}
