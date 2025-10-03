"use client";
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";

import parse from "html-react-parser";
import moment from "moment";
import Image from "next/image";
import { formatFormalName } from "@lib/utils/string.utils";
import { Mail, Phone } from "lucide-react";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { MdBloodtype, MdCheckCircleOutline } from "react-icons/md";

export default function SideComponent({ donor }) {
    const user = donor?.user;
    const bloodType = donor?.blood_type;
    const agency = donor?.agency;
    const isVerified = donor?.is_bloodtype_verified;

    const blood_collections = donor?.blood_collections;
    const prevCount = Number(
        donor?.blood_history?.previous_donation_count || 0
    );
    const donationCount =
        Number(
            Array.isArray(blood_collections) ? blood_collections.length : 0
        ) + prevCount;

    const prevVolume = Number(
        donor?.blood_history?.previous_donation_volume || 0
    );
    const donationVolume =
        (Array.isArray(blood_collections)
            ? blood_collections.reduce(
                  (acc, collection) => acc + Number(collection?.volume),
                  0
              )
            : 0) + prevVolume;

    return (
        <Card className="p-2 md:p-4 flex flex-col gap-2 h-max">
            <CardHeader className="border-b p-2">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative w-8 h-8 md:w-16 md:h-16 rounded border mx-auto flex-none">
                        <Image
                            src={user?.image || "/default_avatar.png"}
                            alt="User Image"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-xl font-semibold">
                            {user?.full_name || "Username"}
                        </CardTitle>
                        <CardDescription className="flex flex-col mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                                ID#: {donor?.donor_reference_id}
                            </span>
                            <span className="flex-items-center text-blue-600 dark:text-blue-400">
                                <Mail className="w-3" /> {user?.email}
                            </span>
                            <span>{formatFormalName(user?.gender)}</span>
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="text-sm text-gray-700 dark:text-gray-300">
                <div>
                    <div className="flex items-center gap-2">
                        {/* Label */}
                        <div className="text-lg flex-items-center font-semibold text-gray-700 dark:text-gray-300">
                            <span>Blood Type</span>
                            {/* Verification Icon */}
                            {isVerified ? (
                                <MdCheckCircleOutline
                                    className="h-5 w-5 text-green-500"
                                    title="Verified"
                                />
                            ) : (
                                <QuestionMarkCircledIcon
                                    className="h-5 w-5 text-yellow-500"
                                    title="Unverified"
                                />
                            )}
                        </div>

                        {/* Blood Type Badge */}
                        <div className="w-12 h-12 flex items-center justify-center rounded-full border border-red-500 bg-red-600 text-white font-bold shadow-sm">
                            {bloodType?.blood_type ?? "?"}
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    {/* Label */}
                    <div className="text-lg flex-items-center font-semibold text-gray-700 dark:text-gray-300">
                        Blood Donations
                    </div>

                    {/* Blood Type Badge */}
                    <span className="btn btn-block text-center text-xl font-bold border-0 rounded-2xl text-red-500 text-shadow-lg/25 text-shadow-red-400 ">
                        <span>{donationCount}</span>
                        <span className="text-base font-semibold italic">
                            ({donationVolume} ml)
                        </span>
                        <MdBloodtype className="text-xs" />
                    </span>
                </div>
                <div className="mt-4 space-y-1">
                    <div className="font-semibold">Agency:</div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border">
                            <Image
                                src={
                                    agency?.file_url ||
                                    "/default_company_avatar.png"
                                }
                                alt="Agency Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-sm">
                            <div className="font-medium">{agency?.name}</div>
                            <div className="text-gray-500 dark:text-gray-400">
                                {agency?.agency_address}
                            </div>
                            <div className="flex-items-center text-gray-500 dark:text-gray-400">
                                Contact: <Phone className="w-3" />
                                {agency?.contact_number}
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="mt-4 space-y-1">
                    <div className="font-semibold">Coordinator:</div>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border">
                            <Image
                                src={user?.image || "/default_avatar.png"}
                                alt="Avatar"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-sm">
                            <div className="font-medium">
                                {event?.requester?.name}
                            </div>

                            <div className="text-gray-500 dark:text-gray-400">
                                Email: {event?.requester?.email}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                                Contact: {donor?.contact_number}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 space-y-1">
                    <div className="font-semibold">Donor:</div>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border">
                            <Image
                                src={user?.image || "/default_avatar.png"}
                                alt="Avatar"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-sm">
                            <div className="font-medium">{user?.name}</div>
                            <div className="text-gray-500 dark:text-gray-400">
                                {donor?.full_address}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                                Email: {user?.email}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                                Contact: {donor?.contact_number}
                            </div>
                        </div>
                    </div>
                </div> */}
            </CardContent>
        </Card>
    );
}
