"use client";
import clsx from "clsx";
import React from "react";

const Toggle = ({ value, onChange }) => {
    return (
        <div className="flex items-center space-x-4 w-max p-2 rounded-2xl">
            <div
                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    value ? "bg-green-500" : "bg-gray-300"
                }`}
                onClick={() => onChange(!value)} // Update the value on click
            >
                <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                        value ? "translate-x-6" : "translate-x-0"
                    }`}
                ></div>
            </div>
            <span
                className={clsx(
                    "text-sm font-semibold",
                    value ? "text-green-600" : "text-red-600"
                )}
            >
                {value ? "Active" : "Deactivated"}
            </span>
        </div>
    );
};

export default Toggle;
