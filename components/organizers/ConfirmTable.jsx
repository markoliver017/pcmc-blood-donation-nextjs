"use client"
import { formatFormalName } from '@lib/utils/string.utils'
import { Eye, EyeClosed } from 'lucide-react';
import React, { useState } from 'react'

export default function ConfirmTable({ watch }) {
    const [showPassword, setShowPassword] = useState(false);
    return (

        <table className="table border mb-5">
            <tbody>
                <tr className="bg-gray-200 dark:bg-gray-900 border-b border-gray-300">
                    <th colSpan={2}>
                        Agency Administrator
                    </th>
                </tr>
                <tr className="hover:bg-base-300">
                    <th width="20%">First Name:</th>
                    <td>
                        {watch(
                            "first_name"
                        ).toUpperCase()}
                    </td>
                </tr>
                <tr className="hover:bg-base-300">
                    <th width="20%">Last Name:</th>
                    <td>
                        {watch(
                            "last_name"
                        ).toUpperCase()}
                    </td>
                </tr>

                <tr className="bg-gray-200 dark:bg-gray-900 border-b border-gray-300">
                    <th colSpan={2}>
                        Account Credentials
                    </th>
                </tr>
                <tr className="hover:bg-base-300">
                    <th width="20%">Email:</th>
                    <td>
                        {watch(
                            "email"
                        )}
                    </td>
                </tr>
                <tr className="hover:bg-base-300">
                    <th width="20%">Password:</th>
                    <td className='flex-items-center '>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={watch(
                                "password"
                            )}
                            disabled
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className='btn btn-ghost'
                        >
                            {showPassword ? <EyeClosed className='w-3' /> : <Eye className='w-3' />}
                        </button>

                    </td>
                </tr>

                <tr className="bg-gray-200 dark:bg-gray-900 border-b border-gray-300">
                    <th colSpan={2}>
                        Organizer Details
                    </th>
                </tr>
                <tr className="hover:bg-base-300">
                    <th width="20%">Name:</th>
                    <td>
                        {watch(
                            "name"
                        ).toUpperCase()}
                    </td>
                </tr>

                <tr className="hover:bg-base-300">
                    <th>Contact Number:</th>
                    <td>
                        {watch("contact_number")}
                    </td>
                </tr>
                <tr className="hover:bg-base-300">
                    <th>Organization Type:</th>
                    <td>
                        {formatFormalName(
                            watch(
                                "organization_type"
                            )
                        )}
                    </td>
                </tr>
                <tr className="bg-gray-200 dark:bg-gray-900 border-b border-gray-300">
                    <th colSpan={2}>
                        Location Details
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
                    <td>
                        {watch("city_municipality")}
                    </td>
                </tr>
                <tr className="hover:bg-base-300">
                    <th>Area:</th>
                    <td>{watch("province")}</td>
                </tr>
            </tbody>
        </table>


    )
}
