import React from "react";

export default function AdminEventsLayout({ children, eventModal }) {
    return (
        <>
            {eventModal}
            {children}
        </>
    );
}
