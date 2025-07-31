import React from "react";

export default function Skeleton_line() {
    return (
        <div className="flex-1 flex flex-col gap-4 p-2">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-32 w-full"></div>
        </div>
    );
}
