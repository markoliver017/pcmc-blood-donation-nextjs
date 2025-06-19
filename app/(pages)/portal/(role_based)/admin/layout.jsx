import React from "react";

export default function AdminDonorsLayout({ children, modal }) {
    return (
        <>
            {modal}
            {children}
        </>
    );
}
