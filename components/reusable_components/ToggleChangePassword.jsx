"use client";
import clsx from "clsx";
import React from "react";

const ToggleChangePassword = ({ value, onChange }) => {
    return (
        <div className="flex items-center space-x-4 w-max p-2 rounded-2xl">
            <div
                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    value ? "bg-blue-500" : "bg-gray-300"
                }`}
                onClick={() => onChange()} // Update the value on click
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
                    value ? "text-blue-600" : "text-gray-600"
                )}
            >
                {value ? "Change Password ?" : "Change Password ?"}
            </span>
        </div>
    );
};

export default ToggleChangePassword;
