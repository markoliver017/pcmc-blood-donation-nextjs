import React from "react";

export default function UsersLayout({ children, modal }) {
    return (
        <>
            {modal}
            {children}
        </>
    );
}
