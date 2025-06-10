import React from "react";

export default function HostEventsLayout({ children, eventModal }) {
    return (
        <>
            {eventModal}
            {children}
        </>
    );
}
