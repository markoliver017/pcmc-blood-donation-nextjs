import React from "react";

export default function CoordinatorLayout({ children, coorModal }) {
    return (
        <>
            {coorModal}
            {children}
        </>
    );
}
