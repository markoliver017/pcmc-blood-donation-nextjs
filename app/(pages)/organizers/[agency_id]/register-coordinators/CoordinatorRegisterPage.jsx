"use client";
import NewCoordinatorForm from "@components/coordinators/NewCoordinatorForm";
import { Card, CardContent } from "@components/ui/card";
import { PenLineIcon } from "lucide-react";
import Image from "next/image";

import { useState } from "react";

export default function CoordinatorRegisterPage({ agency, agency_id }) {
    const [registerState, setRegisterState] = useState(false);
    return (
        <Card className="p-3 shadow-lg/60 bg-slate-100">
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap sm:flex-nowrap sm:px-5 gap-3 rounded-2xl w-full">
                    {/* Avatar + Agency Name */}
                    <div>
                        <Image
                            width={150}
                            height={150}
                            className="w-full rounded-md object-cover border"
                            src={
                                agency.file_url || "/default_company_avatar.png"
                            }
                            alt="Agency Avatar"
                        />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                        <h2 className="text-2xl font-bold">
                            {agency.name.toUpperCase()}
                        </h2>
                        {/* Agency Details */}
                        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mt-5">
                            <div>
                                <span className="font-semibold">
                                    Email Address:{" "}
                                </span>
                                <span>{agency.organization_type}</span>
                            </div>
                            <div>
                                <span className="font-semibold">
                                    Email Address:{" "}
                                </span>
                                <span>{agency.head.email}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Address: </span>
                                <span>{agency.agency_address}</span>
                            </div>
                        </div>
                        {/* <Link
                                    href="/organizers"
                                    className="btn btn-default cursor-pointer"
                                    tabIndex={-1}
                                >
                                    <BiBuildings />{" "}
                                    <span className="hidden sm:inline-block">
                                        Select other agencies
                                    </span>
                                </Link> */}
                    </div>
                </div>
                {!registerState ? (
                    <div className="flex items-center justify-center px-10">
                        <button
                            onClick={() => setRegisterState(true)}
                            className="btn btn-accent rounded-3xl btn-block text-2xl py-6"
                        >
                            <PenLineIcon /> Register as Coordinator
                        </button>
                    </div>
                ) : (
                    <div className="flex-1">
                        <NewCoordinatorForm
                            role_name="Organizer"
                            agency_id={agency_id}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
