import React from "react";

export default function HostDonorsLayout({ children, donorModal }) {
    return (
        <>
            {donorModal}
            {children}
        </>
    );
}
