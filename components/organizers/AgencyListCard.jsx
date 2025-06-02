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
import { Building2 } from "lucide-react";

export default function AgencyListCard() {
    const { data: agencies, isLoading: agencyIsFetching } = useQuery({
        queryKey: ["agencies"],
        queryFn: fetchActiveAgency,
        staleTime: 10 * 60 * 1000,
        cacheTime: 20 * 60 * 1000,
    });

    if (agencyIsFetching) return <Skeleton_user />;

    if (!agencies || agencies.length === 0)
        return (
            <Card className="col-span-full flex flex-col justify-center items-center text-center py-16 px-4 mt-2">
                <Building2 className="w-12 h-12 mb-4 text-primary" />
                <h2 className="text-xl font-semibold">No Agencies Available</h2>
                <p className="text-gray-500 mt-2 max-w-md">
                    Currently, there are no partner agencies in the system.
                    Please check back later once registrations open for your
                    agency.
                </p>
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
                                href={`/organizers/${agency.id}/register`}
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
