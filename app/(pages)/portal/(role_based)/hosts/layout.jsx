import React from "react";

export default function HostDonorsLayout({ children, modal }) {
    return (
        <>
            {modal}
            {children}
        </>
    );
}
