"use client";
import { formatFormalName } from "@lib/utils/string.utils";
import {
    Building,
    Droplets,
    Eye,
    EyeClosed,
    Key,
    Map,
    MapPin,
    UserCog,
} from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { IoInformation } from "react-icons/io5";

export default function ConfirmTable({ watch }) {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <table className="table border mb-5">
            <tbody>
                <tr className="bg-gray-200 dark:bg-gray-900">
                    <th colSpan={2}>
                        <span className="flex-items-center">
                            <Key />
                            Account Credentials
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
                <tr className="bg-gray-200 dark:bg-gray-900 border-b border-gray-300">
                    <th colSpan={2}>
                        <span className="flex-items-center">
                            <IoInformation />
                            Personal Information
                        </span>
                    </th>
                </tr>
                <tr className="hover:bg-base-300">
                    <th width="20%">Date of Birth:</th>
                    <td>
                        {moment(watch("date_of_birth")).format("MMM DD, YYYY")}
                    </td>
                </tr>

                <tr className="hover:bg-base-300">
                    <th width="20%">Civil Status:</th>
                    <td>{formatFormalName(watch("civil_status") || "Single")}</td>
                </tr>

                <tr className="hover:bg-base-300">
                    <th>Contact Number:</th>
                    <td>{watch("contact_number")}</td>
                </tr>
                <tr className="hover:bg-base-300">
                    <th>Nationality:</th>
                    <td>{watch("nationality")}</td>
                </tr>
                <tr className="hover:bg-base-300">
                    <th>Occupation:</th>
                    <td>{watch("occupation")}</td>
                </tr>
                <tr className="bg-gray-200 dark:bg-gray-900 border-b border-gray-300">
                    <th colSpan={2}>
                        <span className="flex-items-center">
                            <MapPin />
                            Location Details
                        </span>
                    </th>
                </tr>
                <tr className="hover:bg-base-300">
                    <th>Address:</th>
                    <td>{watch("address")}</td>
                </tr>
                <tr className="hover:bg-base-300">
                    <th>Barangay:</th>
                    <td>{watch("barangay")}</td>
                </tr>
                <tr className="hover:bg-base-300">
                    <th>City/Municipality:</th>
                    <td>{watch("city_municipality")}</td>
                </tr>
                <tr className="hover:bg-base-300">
                    <th>Area:</th>
                    <td>{watch("province")}</td>
                </tr>
                <tr className="bg-gray-200 dark:bg-gray-900 border-b border-gray-300">
                    <th colSpan={2}>
                        <span className="flex-items-center">
                            <Droplets />
                            Blood Donation Details
                        </span>
                    </th>
                </tr>
                <tr className="hover:bg-base-300">
                    <th>Regular Donor?</th>
                    <td>{watch("is_regular_donor") ? "Yes" : "No"}</td>
                </tr>
                <tr className="hover:bg-base-300">
                    <th>Blood Type:</th>
                    <td>{watch("blood_type_label")}</td>
                </tr>
                <tr className="hover:bg-base-300">
                    <th>Last Donation Date:</th>
                    <td>
                        {watch("last_donation_date") && moment(watch("last_donation_date")).format(
                            "MMM DD, YYYY"
                        )}
                    </td>
                </tr>
                <tr className="hover:bg-base-300">
                    <th>Blood Service Facility:</th>
                    <td>{watch("blood_service_facility")}</td>
                </tr>
            </tbody>
        </table>
    );
}
