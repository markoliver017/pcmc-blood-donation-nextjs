"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { HistoryIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { bloodCollectionColumns } from "./bloodCollectionColumns";
import { DataTable } from "@components/reusable_components/Datatable";
import DonorPreviousDonationTabForm from "@components/admin/blood-collections/DonorPreviousDonationTabForm";
import { BiCollection } from "react-icons/bi";

export default function TabContent({ donor }) {
    const router = useRouter();

    const blood_collections = donor?.blood_collections;
    return (
        <Card className="col-span-1 md:col-span-3 bg-gray-100 relative">
            <CardHeader className="text-2xl font-bold hidden">
                <CardTitle>Blood Donation Details</CardTitle>
            </CardHeader>
            <CardContent id="form-modal" className=" p-0">
                <button
                    onClick={() => router.back()}
                    type="button"
                    className="btn absolute right-5"
                >
                    <FaArrowLeft />{" "}
                    <span className="hidden md:inline-block">Back</span>
                </button>

                <Tabs defaultValue="blood-collections" className="px-1">
                    <TabsList className="flex flex-wrap p-2">
                        <TabsTrigger
                            value="blood-collections"
                            title="Blood Collections"
                        >
                            <div className="flex items-center gap-1 px-3 ring-offset-1  hover:text-blue-500">
                                <BiCollection className="md:h-6 md:w-6" />
                                <span className="hidden md:inline-block">
                                    Blood Collection Summary
                                </span>
                            </div>
                        </TabsTrigger>

                        <TabsTrigger
                            value="donor-previous-donations"
                            title="Previous Donations"
                        >
                            <div className="flex items-center gap-1 px-3 ring-offset-1  hover:text-blue-500">
                                <HistoryIcon className="h-4 w-4 md:h-6 md:w-6" />
                                <span className="hidden md:inline-block">
                                    Donor's Previous Donations
                                </span>
                            </div>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="blood-collections">
                        <DataTable
                            columns={bloodCollectionColumns}
                            data={blood_collections}
                        />
                    </TabsContent>
                    <TabsContent
                        className="md:p-2"
                        value="donor-previous-donations"
                    >
                        <DonorPreviousDonationTabForm donor={donor} />
                    </TabsContent>
                </Tabs>

                {/* <div>
                            <h1>Appointment Data</h1>
                            <pre>{JSON.stringify(appointment, null, 3)}</pre>
                        </div> */}
            </CardContent>
        </Card>
    );
}
