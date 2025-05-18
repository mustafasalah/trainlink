import React from "react";

export default function Modal({
    show = false,
    title,
    onClose,
    children,
    className,
}) {
    return (
        <div
            style={{
                display: show ? "" : "none",
                position: "fixed",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 9,
            }}
        >
            <div className={className} style={{ zIndex: 99 }}>
                <div class={className + "-head"}>
                    <h2>{title}</h2>
                    <button onClick={onClose}>
                        <i class="icon-x"></i>
                    </button>
                </div>
                <div className={className + "-content"}>{children}</div>
            </div>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 9,
                }}
            ></div>
        </div>
    );
}
