"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@components/ui/card";

import { DataTable } from "@components/reusable_components/Datatable";

import { useState } from "react";

import {
    fetchAllBloodRequests,
    updateBloodRequestStatus,
} from "@action/bloodRequestAction";

import { List, Search } from "lucide-react";
import DateRangePickerComponent from "@components/reusable_components/DateRangePickerComponent";
import moment from "moment";
import { useQuery as useQueryTanstack } from "@tanstack/react-query";
import { fetchBloodTypes } from "@action/bloodRequestAction";
import { toast, Toaster } from "sonner";
import { getColumns } from "./columns";
import DetailsModal from "@components/blood_request/DetailsModal";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { GrEmergency } from "react-icons/gr";

export default function AdminEmergencyRequestsPage() {
    const queryClient = useQueryClient();
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    // Filter state
    const [statusFilter, setStatusFilter] = useState("");
    const [dateRange, setDateRange] = useState([
        {
            startDate: moment().startOf("year").toDate(),
            endDate: moment().endOf("year").toDate(),
            key: "selection",
        },
    ]);

    const [searchText, setSearchText] = useState("");
    const { data: response, isLoading } = useQuery({
        queryKey: ["admin-blood-requests"],
        queryFn: fetchAllBloodRequests,
    });
    const requests = response?.success ? response.data : [];
    // Dashboard stats
    const stats = {
        pending: requests.filter((req) => req.status === "pending").length,
        fulfilled: requests.filter((req) => req.status === "fulfilled").length,
        rejected: requests.filter((req) => req.status === "rejected").length,
        cancelled: requests.filter((req) => req.status === "cancelled").length,
    };
    // Approve mutation
    const { mutate: updateRequestStatus, isPending: isApproving } = useMutation(
        {
            mutationFn: async ({ id, status, remarks }) => {
                const res = await updateBloodRequestStatus({
                    id,
                    status,
                    remarks,
                });
                if (!res.success) throw res;
                return res;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["admin-blood-requests"],
                });
                setDetailsOpen(false);
                setSelectedRequest(null);
                toast.success("Request updated successfully");
            },
            onError: (error) => {
                toast.error(error?.message || "Failed to approve request");
            },
        }
    );
    const handleShowDetails = (request) => {
        setSelectedRequest(request);
        setDetailsOpen(true);
    };
    // Blood type filter
    const { data: bloodTypesResponse } = useQueryTanstack({
        queryKey: ["blood-types"],
        queryFn: fetchBloodTypes,
    });
    const bloodTypes = bloodTypesResponse?.success
        ? bloodTypesResponse.data
        : [];
    const [bloodTypeFilter, setBloodTypeFilter] = useState("");
    // Filtering logic
    const filteredRequests = requests.filter((req) => {
        // Status filter
        if (statusFilter && req.status !== statusFilter) return false;
        // Blood type filter
        if (
            bloodTypeFilter &&
            req.blood_type?.id?.toString() !== bloodTypeFilter
        )
            return false;
        // Date range filter
        const reqDate = new Date(req.date);
        if (reqDate < dateRange[0].startDate || reqDate > dateRange[0].endDate)
            return false;
        // Search filter (patient name, hospital, agency)
        const search = searchText.toLowerCase();
        if (
            search &&
            !(
                (req.patient_name &&
                    req.patient_name.toLowerCase().includes(search)) ||
                (req.hospital_name &&
                    req.hospital_name.toLowerCase().includes(search)) ||
                (req.user?.donor?.agency?.name &&
                    req.user.donor.agency.name.toLowerCase().includes(search))
            )
        )
            return false;
        return true;
    });
    const columns = getColumns(
        updateRequestStatus,
        isApproving,
        handleShowDetails
    );
    return (
        <>
            <WrapperHeadMain
                icon={<GrEmergency />}
                pageTitle="Emergency Blood Requests"
                breadcrumbs={[
                    {
                        path: "/portal/admin/emergency-requests",
                        icon: <List className="w-4" />,
                        title: "List of Blood Requests",
                    },
                ]}
            />
            <div className="container mx-auto px-1 md:px-6 space-y-2 md:space-y-6">
                <Toaster />
                <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-6 gap-2 text-center">
                    <Card>
                        <CardHeader>
                            <h3 className="md:text-lg font-semibold">
                                Pending
                            </h3>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-500 ">
                                {stats.pending}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <h3 className="md:text-lg font-semibold">
                                Approved
                            </h3>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-500">
                                {stats.fulfilled}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <h3 className="md:text-lg font-semibold">
                                Rejected
                            </h3>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-500">
                                {stats.rejected}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <h3 className="md:text-lg font-semibold">
                                Cancelled
                            </h3>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-500">
                                {stats.cancelled}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Filters */}
                <div className="flex flex-wrap gap-1 md:gap-4 items-center bg-slate-50 dark:bg-neutral-900 p-4 rounded-lg shadow mb-4">
                    <div className="flex flex-1 gap-1">
                        <div className="flex-1 flex flex-col">
                            <label className="text-xs font-semibold mb-1">
                                Status
                            </label>
                            <select
                                className="border rounded-md p-1 dark:bg-neutral-800 dark:text-neutral-50"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                            >
                                <option value="">All</option>
                                <option value="pending">Pending</option>
                                <option value="fulfilled">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="flex-1 flex flex-col">
                            <label className="text-xs font-semibold mb-1">
                                Blood Type
                            </label>
                            <select
                                className="border rounded-md px-2 py-1 min-w-[120px] dark:bg-neutral-800 dark:text-neutral-50"
                                value={bloodTypeFilter}
                                onChange={(e) =>
                                    setBloodTypeFilter(e.target.value)
                                }
                            >
                                <option value="">All</option>
                                {bloodTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.blood_type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex-1 min-w-20 flex flex-col">
                        <label className="text-xs font-semibold mb-1">
                            Date Range
                        </label>
                        <DateRangePickerComponent
                            state={dateRange}
                            handleSelect={(ranges) =>
                                setDateRange([ranges.selection])
                            }
                        />
                    </div>
                    <div className="flex flex-col flex-1 min-w-[200px]">
                        <label className="text-xs font-semibold mb-1">
                            Search
                        </label>
                        <div className="relative input w-full">
                            <input
                                type="text"
                                className="rounded-md px-2 py-1 w-full pl-8 dark:bg-neutral-800 dark:text-neutral-50"
                                placeholder="Patient, Hospital, Agency..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            <Search className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-1 md:p-6">
                    <DataTable
                        columns={columns}
                        data={filteredRequests}
                        isLoading={isLoading}
                    />
                </div>
                <DetailsModal
                    detailsOpen={detailsOpen}
                    setDetailsOpen={setDetailsOpen}
                    selectedRequest={selectedRequest}
                    isApproving={isApproving}
                    updateRequestStatus={updateRequestStatus}
                />
            </div>
        </>
    );
}
