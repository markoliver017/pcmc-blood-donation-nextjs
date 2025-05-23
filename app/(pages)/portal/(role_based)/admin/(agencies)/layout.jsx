import React from "react";

export default function AgenciesLayout({ children, modal }) {
    return (
        <>
            {modal}
            {children}
        </>
    );
}
