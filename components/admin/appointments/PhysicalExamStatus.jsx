"use client";

import React from "react";

/**
 * Renders the status of a physical examination.
 * @param {{ exam: Object }} props - The props object.
 * @param {Object} props.exam - The physical examination object.
 * @returns {JSX.Element}
 */
export default function PhysicalExamStatus({ exam }) {
    if (!exam) {
        return (
            <div className="badge p-2 font-semibold text-xs badge-secondary">
                Not Conducted Yet
            </div>
        );
    }

    const { eligibility_status } = exam;
    let badgeClass = "badge-error";

    if (eligibility_status === "ACCEPTED") {
        badgeClass = "badge-success";
    } else if (eligibility_status === "TEMPORARILY-DEFERRED") {
        badgeClass = "badge-warning";
    }

    return (
        <div className={`badge p-2 font-semibold text-xs ${badgeClass}`}>
            {eligibility_status.toUpperCase()}
        </div>
    );
}
