import React from "react";

export default function Skeleton() {
    return (
        <div className="p-2 md:p-5">
            <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                    <div className="flex flex-col gap-4">
                        <div className="skeleton h-4 w-20"></div>
                        <div className="skeleton h-4 w-28"></div>
                    </div>
                </div>
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-32 w-full"></div>
            </div>
        </div>
    );
}
