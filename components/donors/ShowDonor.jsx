"use client";
import { getCoordinatorById } from "@/action/coordinatorAction";
import { getDonorById } from "@/action/donorAction";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@components/ui/table";
import { calculateAge } from "@lib/utils/string.utils";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import React from "react";
import ApprovalRejectComponent from "./ApprovalRejectComponent";
import { useSession } from "next-auth/react";
import { CheckIcon } from "lucide-react";
import RejectDonor from "./RejectDonor";
import VerifyDonor from "./VerifyDonor";

export default function ShowDonor({ donorId }) {
    const { data: session } = useSession();
    const { data: donor } = useQuery({
        queryKey: ["donor", donorId],
        queryFn: async () => await getDonorById(donorId),
        enabled: !!donorId,
    });

    const { status } = donor;
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
        <Card id="form-modal" className="mt-2 p-5 h-full">
            <CardHeader>
                <CardTitle className="flex justify-between">
                    <div className="text-4xl">{donor.user.full_name}</div>

                    {session &&
                        session?.user.role_name === "Agency Administrator" &&
                        donor?.status === "for approval" && (
                            <div className="flex gap-2">

                                <VerifyDonor
                                    donorData={{
                                        id: donor.id,
                                        status: "activated",
                                    }}
                                    label="Approve"
                                    className="btn btn-success"
                                    icon={<CheckIcon />}
                                />

                                <RejectDonor
                                    donorId={donor.id}
                                    className="btn-error"
                                />
                            </div>
                        )}
                </CardTitle>
                <CardDescription>Donor Information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap xl:flex-nowrap gap-2">
                <CustomAvatar
                    avatar={donor.user.image || "/default_avatar.png"}
                    className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] xl:w-[350px] xl:h-[350px] flex-none"
                />
                <Table className="w-full sm:min-w-sm">
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-semibold">ID</TableCell>
                            <TableCell>{donor.id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Status
                            </TableCell>
                            <TableCell>
                                <div
                                    className={`badge p-2 font-semibold text-xs ${statusClass}`}
                                >
                                    {donor.status.toUpperCase()}
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Agency Name
                            </TableCell>
                            <TableCell>{donor.agency.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Email Address:
                            </TableCell>
                            <TableCell>{donor.user.email}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Contact Number
                            </TableCell>
                            <TableCell>+63{donor.contact_number}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Date of Birth
                            </TableCell>
                            <TableCell>
                                {moment(donor.date_of_birth).format(
                                    "MMM DD, YYYY"
                                )}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">Age</TableCell>
                            <TableCell>
                                {calculateAge(donor.date_of_birth)} years old
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Blood Type
                            </TableCell>
                            <TableCell>
                                {donor?.blood_type?.blood_type}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Comments / Message
                            </TableCell>
                            <TableCell>{donor.comments}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">
                                Remarks
                            </TableCell>
                            <TableCell>{donor.remarks}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
