import React from "react";
import ClientPortal from "../ClientPortal";

export default async function PortalLayout({ children }) {
    return (
        <>
            <ClientPortal />
            {children}
        </>
    );
}
