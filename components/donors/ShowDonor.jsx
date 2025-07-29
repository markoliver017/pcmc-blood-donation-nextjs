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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table";
import { calculateAge, formatFormalName } from "@lib/utils/string.utils";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import React from "react";
import ApprovalRejectComponent from "./ApprovalRejectComponent";
import { useSession } from "next-auth/react";
import { CheckIcon, Info, LinkIcon } from "lucide-react";
import RejectDonor from "./RejectDonor";
import VerifyDonor from "./VerifyDonor";
import Skeleton from "@components/ui/skeleton";
import StarRating from "@components/reusable_components/StarRating";
import Link from "next/link";
import { format } from "date-fns";
import { PiRewindCircleThin } from "react-icons/pi";

export default function ShowDonor({ donorId }) {
    const { data: session } = useSession();
    const { data: donor, isLoading } = useQuery({
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

    if (isLoading) return <Skeleton />;

    const appointments = donor?.appointments || [];
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
                <div className="w-full sm:min-w-sm">
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-semibold">
                                    ID
                                </TableCell>
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
                                <TableCell className="font-semibold">
                                    Age
                                </TableCell>
                                <TableCell>
                                    {calculateAge(donor.date_of_birth)} years
                                    old
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
                    <h2 className="text-2xl mt-5">Appointments</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID#</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Event Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Donor Type</TableHead>
                                <TableHead>comments</TableHead>
                                <TableHead>Feedback</TableHead>
                                <TableHead>...</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appointments && appointments.length > 0 ? (
                                appointments.map((appt) => (
                                    <TableRow key={appt.id}>
                                        <TableCell className="text-slate-500">
                                            {appt?.id}
                                        </TableCell>
                                        <TableCell>
                                            {format(appt?.event.date, "PP")}
                                        </TableCell>
                                        <TableCell>
                                            {appt?.event?.title}
                                        </TableCell>
                                        <TableCell>{appt?.status}</TableCell>
                                        <TableCell>
                                            {appt?.donor_type}
                                        </TableCell>
                                        <TableCell>{appt?.comments}</TableCell>
                                        <TableCell>
                                            <StarRating
                                                rating={
                                                    appt?.feedback_average || 0
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/portal/admin/appointments/${appt?.id}`}
                                                className="btn btn-xs"
                                            >
                                                View
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="font-semibold text-center"
                                    >
                                        No appointments found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <div className="flex gap-3 items-center py-2 mt-5">
                        <h2 className="text-2xl">Blood Donations</h2>
                        <Link
                            href={`/portal/admin/blood-collections/${donor?.id}`}
                            className="btn btn-sm"
                        >
                            More details <Info />
                        </Link>
                    </div>
                    <h3>
                        Manual Blood donation count/volume:{" "}
                        {donor?.blood_history ? (
                            <>
                                {donor?.blood_history?.previous_donation_count}{" "}
                                (
                                {donor?.blood_history?.previous_donation_volume}
                                ml )
                            </>
                        ) : (
                            "0"
                        )}
                    </h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID#</TableHead>
                                <TableHead>Collection Method</TableHead>
                                <TableHead>Volume (ml)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {donor?.blood_collections &&
                            donor?.blood_collections.length > 0 ? (
                                donor?.blood_collections.map((collection) => (
                                    <TableRow key={collection.id}>
                                        <TableCell className="text-slate-500">
                                            {collection?.id}
                                        </TableCell>
                                        <TableCell>
                                            {formatFormalName(
                                                collection?.appointment
                                                    ?.collection_method
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {collection?.volume}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="font-semibold text-center"
                                    >
                                        No blood collections found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
