"use client";
import { formatFormalName } from "@lib/utils/string.utils";
import {
    Building,
    Eye,
    EyeClosed,
    Key,
    Map,
    MapPin,
    User2Icon,
    UserCog,
} from "lucide-react";
import React, { useState } from "react";

export default function CoordinatorConfirmTable({ watch }) {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <table className="table border mb-5">
            <tbody>
                <tr className="bg-gray-200 dark:bg-gray-900 border-b border-gray-300">
                    <th colSpan={2}>
                        <span className="flex-items-center">
                            <User2Icon /> New Coordinator Account
                        </span>
                    </th>
                </tr>
                <tr className="hover:bg-base-300">
                    <th width="20%">First Name:</th>
                    <td>{watch("first_name").toUpperCase()}</td>
                </tr>
                <tr className="hover:bg-base-300">
                    <th width="20%">Middle Name:</th>
                    <td>{watch("middle_name").toUpperCase()}</td>
                </tr>
                <tr className="hover:bg-base-300">
                    <th width="20%">Last Name:</th>
                    <td>{watch("last_name").toUpperCase()}</td>
                </tr>
                <tr className="hover:bg-base-300">
                    <th width="20%">Sex:</th>
                    <td>{formatFormalName(watch("gender") || "N/A")}</td>
                </tr>
                <tr className="hover:bg-base-300">
                    <th width="20%">Contact Number:</th>
                    <td>{watch("contact_number")}</td>
                </tr>

                <tr className="bg-gray-200 dark:bg-gray-900">
                    <th colSpan={2}>
                        <span className="flex-items-center">
                            <Key />
                            Account Credentials
                        </span>
                    </th>
                </tr>
                <tr className="hover:bg-base-300">
                    <th width="20%">Email:</th>
                    <td>{watch("email")}</td>
                </tr>
                <tr className="hover:bg-base-300">
                    <th width="20%">Password:</th>
                    <td className="flex-items-center ">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={watch("password")}
                            disabled
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="btn btn-ghost"
                        >
                            {showPassword ? (
                                <EyeClosed className="w-3" />
                            ) : (
                                <Eye className="w-3" />
                            )}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
