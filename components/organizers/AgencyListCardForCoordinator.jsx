"use client";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { fetchActiveAgency } from "@/action/agencyAction";
import Skeleton_user from "@components/ui/Skeleton_user";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Building2, Droplet, Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function AgencyListCardForCoordinator() {
    const { data: agencies, isLoading: agencyIsFetching } = useQuery({
        queryKey: ["agencies"],
        queryFn: fetchActiveAgency,
        staleTime: 10 * 60 * 1000,
        cacheTime: 20 * 60 * 1000,
    });

    const [search, setSearch] = useState("");

    const filteredAgencies = useMemo(() => {
        if (!agencies) return [];
        return agencies.filter((agency) =>
            agency.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [agencies, search]);

    if (agencyIsFetching) return <Skeleton_user />;

    if (!agencies || agencies.length === 0)
        return (
            <Card className="col-span-full flex flex-col justify-center items-center text-center py-16 px-4 mt-2 bg-gradient-to-br from-red-50 dark:from-red-900 via-white dark:via-white to-blue-50 dark:to-blue-900 border-2 border-dashed border-red-200">
                <Droplet className="w-16 h-16 mb-4 text-red-400 animate-bounce" />
                <h2 className="text-2xl font-bold text-red-700">
                    No Agencies Available
                </h2>
                <p className="text-gray-500 mt-2 max-w-md">
                    Currently, there are no partner agencies in the system.
                    <br />
                    Please check back later once registrations open for your
                    agency.
                </p>
            </Card>
        );
    return (
        <Card className="bg-gradient-to-r from-red-50 dark:from-gray-600 to-blue-50 dark:to-slate-700 border-2 border-blue-100 shadow-xl">
            <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                        <CardTitle className="text-2xl text-red-700 dark:text-red-400 flex items-center gap-2">
                            <Droplet className="w-7 h-7 text-red-400 dark:text-red-400" />
                            Find Your Agency
                        </CardTitle>
                        <CardDescription className="text-md text-blue-700 dark:text-blue-300">
                            Registration is open only to members of our partner
                            agencies. Search below to find your agency.
                        </CardDescription>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center bg-white rounded-md shadow px-2 py-1 border border-blue-200 w-full md:w-80">
                        <Search className="w-5 h-5 text-blue-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search agencies by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 outline-none bg-transparent text-blue-900 placeholder:text-blue-400"
                            aria-label="Search agencies"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="ml-2 text-blue-400 hover:text-red-400"
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="mt-2">
                {filteredAgencies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Building2 className="w-14 h-14 mb-4 text-blue-300 animate-pulse" />
                        <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                            No agencies found
                        </h3>
                        <p className="text-gray-500 mt-1 dark:text-gray-400">
                            Try a different search term or check back later.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {filteredAgencies.map((agency, i) => (
                            <Link
                                href={`/organizers/${agency.id}/register-coordinators`}
                                replace={true}
                                key={agency.id || i}
                                className="group"
                            >
                                <Card className="transition-transform duration-200 hover:scale-105 hover:shadow-2xl border-2 border-blue-100 bg-white/90 dark:bg-gray-800/90 group-hover:border-red-200 group-hover:bg-red-50">
                                    <div className="flex items-center gap-4 p-5">
                                        <CustomAvatar
                                            avatar={
                                                agency?.file_url ||
                                                "/default_company_avatar.png"
                                            }
                                            className="flex-none w-[56px] h-[56px] rounded-full border-2 border-red-200 shadow-md group-hover:border-blue-400 group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="flex-1 flex flex-col gap-1">
                                            <span className="font-bold text-blue-900 dark:text-blue-400 text-lg group-hover:text-red-600 transition-colors">
                                                {agency.name}
                                            </span>
                                            <span className="text-xs text-blue-600 group-hover:text-red-400 transition-colors">
                                                {agency.agency_address}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
    return (
        <Card>
            <CardHeader>
                <CardTitle>Find your agency:</CardTitle>
                <CardDescription>
                    Currently, registration is open only to members of our
                    partner agencies.
                </CardDescription>
                <CardContent className="mt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {agencies.map((agency, i) => (
                            <Link
                                href={`/organizers/${agency.id}/register-coordinators`}
                                key={i}
                            >
                                <Card className="hover:ring-2 hover:ring-blue-400 group transition shadow-lg/40">
                                    <CardHeader className="hidden">
                                        <CardTitle></CardTitle>
                                    </CardHeader>
                                    <div className="flex items-center gap-2 p-5">
                                        <CustomAvatar
                                            avatar={
                                                agency?.file_url ||
                                                "/default_company_avatar.png"
                                            }
                                            className="flex-none w-[50px] h-[50px] transform transition-transform duration-300 group-hover:scale-120"
                                        />
                                        <div className="flex-1 flex flex-col gap-2">
                                            <span>{agency.name}</span>
                                            <span className="text-xs">
                                                {agency.agency_address}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </CardHeader>
        </Card>
    );
}
