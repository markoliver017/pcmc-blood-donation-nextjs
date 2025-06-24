"use client";
import { fetchAgency } from "@/action/agencyAction";
import { getUser } from "@/action/userAction";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import { Button } from "@components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table";
import { formatFormalName } from "@lib/utils/string.utils";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function ShowAgency({ agencyId }) {
    const router = useRouter();
    const { data: agency } = useQuery({
        queryKey: ["agency", agencyId],
        queryFn: async () => await fetchAgency(agencyId),
        enabled: !!agencyId,
    });

    const { status } = agency;
    let statusClass = "badge-primary";
    if (status == "activated") {
        statusClass = "badge-success";
    } else if (status == "deactivated") {
        statusClass = "badge-warning";
    } else if (status == "rejected") {
        statusClass = "badge-error";
    }
    // return "";
    return (
        <Card className="mt-2 p-5 h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-5">
                    <div className="text-4xl">{agency.name}</div>
                    <Button
                        onClick={() => router.push(`./${agency.id}/edit`)}
                        variant="secondary"
                        className="hidden hover:bg-orange-300 active:ring-2 active:ring-orange-800 dark:active:ring-orange-200"
                    >
                        <Pencil />
                    </Button>
                </CardTitle>
                <CardDescription>Agency Information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap xl:flex-nowrap gap-2">
                <CustomAvatar
                    avatar={agency.file_url || "/default_company_avatar.png"}
                    className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] xl:w-[350px] xl:h-[350px] flex-none"
                />
                <Table className="w-full sm:min-w-sm">
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-semibold">ID</TableCell>
                            <TableCell>{agency.id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Status
                            </TableCell>
                            <TableCell>
                                <div
                                    className={`badge p-2 font-semibold text-xs ${statusClass}`}
                                >
                                    {agency.status.toUpperCase()}
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Head
                            </TableCell>
                            <TableCell>
                                {formatFormalName(
                                    agency.head.name || agency.head.full_name
                                )}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Agency Email
                            </TableCell>
                            <TableCell>
                                <a
                                    className="link link-primary italic"
                                    href={`mailto:${agency.head.email}`}
                                >
                                    {agency.head.email.toLowerCase() || "N/A"}
                                </a>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Contact Number
                            </TableCell>
                            <TableCell>
                                <span>+63{agency.contact_number}</span>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Organization Type
                            </TableCell>
                            <TableCell>
                                {formatFormalName(agency.organization_type)}
                                &nbsp;
                                {agency.other_organization_type && (
                                    <>({agency.other_organization_type})</>
                                )}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Address
                            </TableCell>
                            <TableCell>{agency.address}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Barangay
                            </TableCell>
                            <TableCell>{agency.barangay}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                City
                            </TableCell>
                            <TableCell>{agency.city_municipality}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Area
                            </TableCell>
                            <TableCell>{agency.province}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Comments / Message
                            </TableCell>
                            <TableCell>{agency.comments}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Remarks
                            </TableCell>
                            <TableCell>{agency.remarks}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} className="pt-6">
                                <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                                    <h3 className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-200">
                                        Coordinators
                                    </h3>

                                    <div className="overflow-x-auto">
                                        <Table className="w-full text-sm">
                                            <TableHeader>
                                                <TableRow className="bg-slate-200 dark:bg-slate-700">
                                                    <TableHead className="font-semibold text-slate-700 dark:text-slate-100">
                                                        Name
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-slate-700 dark:text-slate-100">
                                                        Email
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-slate-700 dark:text-slate-100">
                                                        Contact Number
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {agency?.coordinators?.length >
                                                0 ? (
                                                    agency.coordinators.map(
                                                        (coor, index) => (
                                                            <TableRow
                                                                key={index}
                                                                className="text-slate-700 dark:text-slate-200"
                                                            >
                                                                <TableCell>
                                                                    {coor.full_name ||
                                                                        coor.name}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {coor.email ||
                                                                        "N/A"}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {coor?.AgencyCoordinator
                                                                        ? `+63${coor.AgencyCoordinator?.contact_number}`
                                                                        : "N/A"}
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )
                                                ) : (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={3}
                                                            className="text-center text-slate-500"
                                                        >
                                                            No coordinators
                                                            listed.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
