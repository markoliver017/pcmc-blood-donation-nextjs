"use client";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import Skeleton_user from "@components/ui/Skeleton_user";
// import { fetchAgencyByStatus } from "@/action/agencyAction";
// import { useQuery } from "@tanstack/react-query";
import { formatFormalName } from "@lib/utils/string.utils";
import moment from "moment";
import ApprovalRejectComponent from "@components/organizers/ApprovalRejectComponent";
import { CheckIcon, FileClock } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function ForApprovalAgencyList({
    target = "",
    avatarClassName = "",
    agencies = [],
    isFetching = true,
}) {
    const [search, setSearch] = useState("");
    const filteredAgencies = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return agencies;
        return agencies.filter((agency) => {
            const fields = [
                agency.name,
                agency.agency_address,
                agency?.head?.full_name,
                agency?.head?.email,
                agency?.contact_number ? `+63${agency.contact_number}` : "",
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return fields.includes(q);
        });
    }, [agencies, search]);

    if (isFetching)
        return (
            <>
                <Skeleton_user />
                <Skeleton_user />
                <Skeleton_user />
            </>
        );

    if (!agencies || agencies.length === 0)
        return (
            <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                <FileClock className="w-12 h-12 mb-4 text-primary" />
                <h2 className="text-xl font-semibold">No Pending Approvals</h2>
                <p className="text-gray-500 mt-2">You're all caught up! 🎉</p>
            </Card>
        );

    return (
        <>
            <div className="col-span-full mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search agencies, head, email, contact, address..."
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                />
            </div>
            {filteredAgencies.length === 0 ? (
                <Card className="col-span-full flex flex-col justify-center items-center text-center py-12">
                    <FileClock className="w-10 h-10 mb-3" />
                    <h2 className="text-lg font-semibold">No results</h2>
                    <p className="text-gray-500 mt-1">
                        Try a different search term.
                    </p>
                </Card>
            ) : (
                filteredAgencies.map((agency) => (
                    <Card
                        key={agency.id}
                        className="hover:ring-2 flex flex-col justify-between hover:ring-blue-400 group transition shadow-lg/40"
                    >
                        <CardHeader>
                            <CardTitle className="flex flex-wrap justify-between">
                                <span className="text-xl">{agency.name}</span>
                                <span className="text-sm text-slate-600 dark:text-slate-300">
                                    {moment(agency.createdAt).format(
                                        "MMM DD, YYYY"
                                    )}
                                </span>
                            </CardTitle>
                            <CardDescription className="flex flex-wrap flex-col gap-1 dark:text-slate-300">
                                <div className="flex justify-between">
                                    <div>
                                        <span>
                                            {formatFormalName(
                                                agency.organization_type
                                            )}
                                        </span>
                                        {agency.other_organization_type && (
                                            <span>
                                                &nbsp;(
                                                {agency.other_organization_type}
                                                )
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span>{agency.agency_address}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap items-center justify-center gap-4 px-2 md:px-15 transform transition-transform duration-300 group-hover:scale-105 md:group-hover:scale-110">
                            <div>
                                <CustomAvatar
                                    avatar={
                                        agency?.file_url ||
                                        "/default_company_avatar.png"
                                    }
                                    className={clsx(
                                        "flex-none w-[50px] h-[50px]",
                                        avatarClassName
                                    )}
                                />
                            </div>
                            <div className="md:flex-1 flex flex-col gap-2">
                                <span className="text-lg text-slate-800 dark:text-slate-300 font-semibold">
                                    {agency.head.full_name}
                                </span>
                                <span className="text-blue-700 italic">
                                    {agency.head.email.toLowerCase()}
                                </span>
                                <span className=" text-slate-700 dark:text-slate-300 italic">
                                    +63
                                    {agency.contact_number}
                                </span>
                            </div>
                        </CardContent>
                        <ApprovalRejectComponent
                            agency={agency}
                            target={target}
                        />
                    </Card>
                ))
            )}
        </>
    );
}
