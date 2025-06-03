import React from "react";

export default function AdminDonorsLayout({ children, donorModal }) {
    return (
        <>
            {donorModal}
            {children}
        </>
    );
}
