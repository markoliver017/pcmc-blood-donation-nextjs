"use client";

import React from "react";

/**
 * Renders the status of a blood collection.
 * @param {{ collection: Object }} props - The props object.
 * @param {Object} props.collection - The blood collection object.
 * @returns {JSX.Element}
 */
export default function BloodCollectionStatus({ collection }) {
    if (!collection) {
        return (
            <div className="badge p-2 font-semibold text-xs badge-secondary">
                Not Conducted Yet
            </div>
        );
    }

    if (collection?.volume) {
        const volume = Number(collection.volume);
        const displayVolume = Number.isInteger(volume)
            ? volume.toString()
            : volume.toFixed(2);

        return (
            <div className="badge p-2 font-semibold text-lg">
                {displayVolume} ml
            </div>
        );
    }

    return null; // Return null if no volume is present
}
