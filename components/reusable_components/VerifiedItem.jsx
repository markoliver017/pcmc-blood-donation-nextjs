"use client";

import React from "react";
import { MdCheckCircleOutline } from "react-icons/md";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

/**
 * Displays an item with a verification status icon.
 * @param {{ value: string, isVerified: boolean }} props - The props object.
 * @returns {JSX.Element}
 */
export default function VerifiedItem({ value, isVerified }) {
    const Icon = isVerified ? MdCheckCircleOutline : QuestionMarkCircledIcon;
    const iconColor = isVerified ? "text-green-500" : "text-red-500";

    return (
        <div className="btn btn-ghost p-2 font-bold rounded-full">
            {value} <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
    );
}
