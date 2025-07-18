"use client";
import { getCoordinatorById } from "@/action/coordinatorAction";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@components/ui/table";
import { useQuery } from "@tanstack/react-query";

import React from "react";
import VerifyCoordinator from "./VerifyCoordinator";
import { CheckIcon } from "lucide-react";
import RejectCoordinator from "./RejectCoordinator";
import { useSession } from "next-auth/react";

export default function ShowCoordinator({ coorId }) {
    const { data: session } = useSession();
    const { data: coordinator } = useQuery({
        queryKey: ["coordinator", coorId],
        queryFn: async () => await getCoordinatorById(coorId),
        enabled: !!coorId,
    });

    const { status } = coordinator;
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
        <Card className="p-5 h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex">
                            <div className="text-4xl">
                                {coordinator.user.full_name}
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Coordinator Information
                        </CardDescription>
                    </div>
                    {session &&
                        (session?.user.role_name === "Agency Administrator" ||
                            session?.user.role_name === "Organizer") &&
                        coordinator.status === "for approval" && (
                            <div className="flex-items-center">
                                <VerifyCoordinator
                                    agencyData={{
                                        id: coordinator.id,
                                        status: "activated",
                                    }}
                                    label="Approve"
                                    className="btn btn-success"
                                    formClassName="w-full"
                                    icon={<CheckIcon />}
                                />
                                <RejectCoordinator
                                    coordinatorId={coordinator.id}
                                    className="btn-error"
                                />
                            </div>
                        )}
                </div>
            </CardHeader>
            <CardContent className="flex flex-wrap xl:flex-nowrap gap-2">
                <CustomAvatar
                    avatar={coordinator.user.image || "/default_avatar.png"}
                    className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] xl:w-[350px] xl:h-[350px] flex-none"
                />
                <Table className="w-full sm:min-w-sm">
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-semibold">ID</TableCell>
                            <TableCell>{coordinator.id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Status
                            </TableCell>
                            <TableCell>
                                <div
                                    className={`badge p-2 font-semibold text-xs ${statusClass}`}
                                >
                                    {coordinator.status.toUpperCase()}
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Agency Name
                            </TableCell>
                            <TableCell>{coordinator.agency.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Email Address:
                            </TableCell>
                            <TableCell>{coordinator.user.email}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Contact Number
                            </TableCell>
                            <TableCell>
                                +63{coordinator.contact_number}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Comments / Message
                            </TableCell>
                            <TableCell>{coordinator.comments}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Remarks
                            </TableCell>
                            <TableCell>{coordinator.remarks}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
