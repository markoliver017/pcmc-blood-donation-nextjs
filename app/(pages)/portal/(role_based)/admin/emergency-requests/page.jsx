"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { DataTable } from "@components/reusable_components/Datatable";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@components/ui/dialog";
import { useState } from "react";

import {
    fetchAllBloodRequests,
    updateBloodRequestStatus,
} from "@action/bloodRequestAction";
import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import {
    User,
    Hospital,
    Calendar,
    Building2,
    FileText,
    Droplet,
    BadgeCheck,
    ClipboardList,
    Search,
} from "lucide-react";
import DateRangePickerComponent from "@components/reusable_components/DateRangePickerComponent";
import moment from "moment";
import { useQuery as useQueryTanstack } from "@tanstack/react-query";
import { fetchBloodTypes } from "@action/bloodRequestAction";

function getColumns(approveRequest, isApproving, onShowDetails) {
    return [
        {
            accessorKey: "blood_component",
            header: "Component",
            cell: ({ row }) => {
                const component = row.original.blood_component;
                return component.charAt(0).toUpperCase() + component.slice(1);
            },
        },
        {
            accessorKey: "blood_type.blood_type",
            header: "Blood Type",
        },
        {
            accessorKey: "no_of_units",
            header: "Units",
        },
        {
            accessorKey: "patient_name",
            header: "Patient Name",
            cell: ({ row }) => {
                const donor = row.original.user;
                return donor
                    ? `${donor.first_name} ${donor.last_name}`
                    : row.original.patient_name;
            },
        },
        {
            accessorKey: "hospital_name",
            header: "Hospital",
        },
        {
            accessorKey: "date",
            header: "Date Needed",
            cell: ({ row }) =>
                format(new Date(row.original.date), "MMM dd, yyyy"),
        },
        {
            accessorKey: "agency_name",
            header: "Agency",
            cell: ({ row }) => {
                // Try to get agency name from donor->agency
                return (
                    row.original.user?.donor?.agency?.name || (
                        <span className="italic text-gray-400">N/A</span>
                    )
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;
                const colors = {
                    pending: "bg-orange-100 text-orange-800",
                    fulfilled: "bg-green-100 text-green-800",
                    expired: "bg-red-100 text-red-800",
                    cancelled: "bg-gray-200 text-gray-600",
                };
                return (
                    <Badge
                        className={
                            colors[status] || "bg-gray-200 text-gray-600"
                        }
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const id = row.original.id;
                const status = row.original.status;
                return (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onShowDetails(row.original)}
                            className="flex items-center gap-1"
                        >
                            <span className="hidden md:inline">Details</span>
                        </Button>
                        <Button
                            size="sm"
                            disabled={status !== "pending" || isApproving}
                            onClick={() => {
                                SweetAlert({
                                    title: "Approve Blood Request?",
                                    text: "Are you sure you want to mark this blood request as fulfilled? This action will also send a notification to the user who initiated the request.",
                                    icon: "info",
                                    showCancelButton: true,
                                    confirmButtonText: "Yes, approve",
                                    cancelButtonText: "No",
                                    onConfirm: () => approveRequest(id),
                                });
                            }}
                            className="flex items-center gap-1 bg-green-500 text-white"
                        >
                            <CheckCircle className="w-4 h-4" />
                            <span className="hidden md:inline">Approve</span>
                        </Button>
                    </div>
                );
            },
        },
    ];
}

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
        expired: requests.filter((req) => req.status === "expired").length,
        cancelled: requests.filter((req) => req.status === "cancelled").length,
    };
    // Approve mutation
    const { mutate: approveRequest, isPending: isApproving } = useMutation({
        mutationFn: async (id) => {
            const res = await updateBloodRequestStatus({
                id,
                status: "fulfilled",
            });
            if (!res.success) throw res;
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-blood-requests"],
            });
            notify({ message: "Request approved (fulfilled) successfully" });
        },
        onError: (error) => {
            notify({
                error: true,
                message: error?.message || "Failed to approve request",
            });
        },
    });
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
    const columns = getColumns(approveRequest, isApproving, handleShowDetails);
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    All Emergency Blood Requests
                </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Pending</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-500">
                            {stats.pending}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Fulfilled</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-500">
                            {stats.fulfilled}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Expired</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-500">
                            {stats.expired}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Cancelled</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-500">
                            {stats.cancelled}
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center bg-slate-50 dark:bg-neutral-900 p-4 rounded-lg shadow mb-4">
                <div className="flex flex-col">
                    <label className="text-xs font-semibold mb-1">Status</label>
                    <select
                        className="border rounded-md px-2 py-1 dark:bg-neutral-800 dark:text-neutral-50"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-semibold mb-1">
                        Blood Type
                    </label>
                    <select
                        className="border rounded-md px-2 py-1 dark:bg-neutral-800 dark:text-neutral-50"
                        value={bloodTypeFilter}
                        onChange={(e) => setBloodTypeFilter(e.target.value)}
                    >
                        <option value="">All</option>
                        {bloodTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.blood_type}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
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
                    <label className="text-xs font-semibold mb-1">Search</label>
                    <div className="relative input">
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
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-6">
                <DataTable
                    columns={columns}
                    data={filteredRequests}
                    isLoading={isLoading}
                />
            </div>
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-blue-500" />{" "}
                            Blood Request Details
                        </DialogTitle>
                        <DialogDescription>
                            Detailed information for this blood request.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="space-y-5 space-x-5 mt-2">
                            <div className="flex items-center justify-between gap-2">
                                <b className="flex-items-center">
                                    <Droplet className="w-4 h-4 text-red-500" />
                                    Component:
                                </b>{" "}
                                <div className="flex-none w-48">
                                    {selectedRequest.blood_component}
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <b className="flex-items-center">
                                    <BadgeCheck className="w-4 h-4 text-purple-500" />
                                    Blood Type:
                                </b>{" "}
                                <div className="flex-none w-48">
                                    {selectedRequest.blood_type?.blood_type}
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <b className="flex-items-center">
                                    <BadgeCheck className="w-4 h-4 text-yellow-500" />
                                    Units:
                                </b>{" "}
                                <div className="flex-none w-48">
                                    {selectedRequest.no_of_units}
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <b className="flex-items-center">
                                    <User className="w-4 h-4 text-blue-400" />
                                    Patient Name:
                                </b>{" "}
                                <div className="flex-none w-48">
                                    {selectedRequest.patient_name ||
                                        (selectedRequest.user
                                            ? `${selectedRequest.user.first_name} ${selectedRequest.user.last_name}`
                                            : "-")}
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <b className="flex-items-center">
                                    <Hospital className="w-4 h-4 text-pink-500" />
                                    Hospital:
                                </b>{" "}
                                <div className="flex-none w-48">
                                    {selectedRequest.hospital_name}
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <b className="flex-items-center">
                                    <Calendar className="w-4 h-4 text-green-500" />
                                    Date Needed:
                                </b>{" "}
                                <div className="flex-none w-48">
                                    {format(
                                        new Date(selectedRequest.date),
                                        "MMM dd, yyyy"
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <b className="flex-items-center">
                                    <Building2 className="w-4 h-4 text-gray-700" />
                                    Agency:
                                </b>{" "}
                                <div className="flex-none w-48">
                                    {selectedRequest.user?.donor?.agency
                                        ?.name || (
                                        <span className="italic text-gray-400">
                                            N/A
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <b className="flex-items-center">
                                    <Badge className="w-4 h-4 text-gray-500" />
                                    Status:
                                </b>{" "}
                                <div className="flex-none w-48">
                                    <Badge
                                        variant={
                                            selectedRequest.status === "pending"
                                                ? "secondary"
                                                : selectedRequest.status ===
                                                  "fulfilled"
                                                ? "default"
                                                : selectedRequest.status ===
                                                  "expired"
                                                ? "destructive"
                                                : "outline"
                                        }
                                    >
                                        {selectedRequest.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            selectedRequest.status.slice(1)}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <b className="flex-items-center">
                                    <ClipboardList className="w-4 h-4 text-indigo-500" />
                                    Diagnosis:
                                </b>{" "}
                                <div className="flex-none w-48">
                                    {selectedRequest.diagnosis}
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <b className="flex-items-center">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    File:
                                </b>{" "}
                                <div className="flex-none w-48">
                                    {selectedRequest.file_url ? (
                                        <a
                                            href={selectedRequest.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline text-blue-600"
                                        >
                                            View PDF
                                        </a>
                                    ) : (
                                        <span className="italic text-gray-400">
                                            N/A
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
