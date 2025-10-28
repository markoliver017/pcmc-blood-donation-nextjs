"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import {
    CalendarIcon,
    Download,
    Filter,
    Loader2,
    Heart,
    Package,
    Calendar,
    Users,
    Building2,
} from "lucide-react";
import { Badge } from "@components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table";
import { getAllAgencyOptions } from "@/action/adminEventAction";
import { useQuery } from "@tanstack/react-query";

// Report Context for managing filters across tabs
const ReportContext = createContext();

export const useReportContext = () => {
    const context = useContext(ReportContext);
    if (!context) {
        throw new Error(
            "useReportContext must be used within a ReportProvider"
        );
    }
    return context;
};

const ReportProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        agency: "ALL",
        bloodType: "ALL",
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            startDate: "",
            endDate: "",
            agency: "ALL",
            bloodType: "ALL",
        });
    };

    // PDF Export functionality
    const exportToPDF = async (reportType) => {
        setIsGenerating(true);
        try {
            // Build query parameters
            const params = new URLSearchParams();
            if (filters.startDate)
                params.append("startDate", filters.startDate);
            if (filters.endDate) params.append("endDate", filters.endDate);
            if (filters.agency && filters.agency !== "ALL")
                params.append("agency", filters.agency);
            if (filters.bloodType && filters.bloodType !== "ALL")
                params.append("bloodType", filters.bloodType);

            // Create download URL
            const res = await fetch(`/api/reports/${reportType}/pdf?${params}`);
            if (!res.ok) throw new Error("PDF generation failed");
            // download blob
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            // Trigger download
            const link = document.createElement("a");
            link.href = url;
            link.download = `${reportType}-report-${
                new Date().toISOString().split("T")[0]
            }.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("PDF export failed:", error);
            // You could add a toast notification here
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <ReportContext.Provider
            value={{
                filters,
                updateFilter,
                clearFilters,
                exportToPDF,
                isGenerating,
            }}
        >
            {children}
        </ReportContext.Provider>
    );
};

// Filter Bar Component
const FilterBar = () => {
    const { filters, updateFilter, clearFilters } = useReportContext();

    const { data: agencies, isLoading } = useQuery({
        queryKey: ["agencies"],
        queryFn: async () => {
            const res = await getAllAgencyOptions();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    if (isLoading) {
        return <Loader2 className="animate-spin" />;
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Report Filters
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <div className="relative">
                            <Input
                                id="startDate"
                                type="date"
                                value={filters.startDate}
                                onChange={(e) =>
                                    updateFilter("startDate", e.target.value)
                                }
                                className="pl-10"
                            />
                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <div className="relative">
                            <Input
                                id="endDate"
                                type="date"
                                value={filters.endDate}
                                onChange={(e) =>
                                    updateFilter("endDate", e.target.value)
                                }
                                className="pl-10"
                            />
                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="agency">Agency</Label>
                        <Select
                            value={filters.agency}
                            onValueChange={(value) =>
                                updateFilter("agency", value)
                            }
                            disabled
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Agency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">
                                    All Agencies
                                </SelectItem>
                                {agencies?.map((agency) => (
                                    <SelectItem
                                        key={agency.id}
                                        value={agency.id}
                                    >
                                        {agency.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bloodType">Blood Type</Label>
                        <Select
                            value={filters.bloodType}
                            onValueChange={(value) =>
                                updateFilter("bloodType", value)
                            }
                            disabled
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Blood Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Types</SelectItem>
                                <SelectItem value="A +">A+</SelectItem>
                                <SelectItem value="A -">A-</SelectItem>
                                <SelectItem value="B +">B+</SelectItem>
                                <SelectItem value="B -">B-</SelectItem>
                                <SelectItem value="AB +">AB+</SelectItem>
                                <SelectItem value="AB -">AB-</SelectItem>
                                <SelectItem value="O +">O+</SelectItem>
                                <SelectItem value="O -">O-</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                        {filters.startDate && (
                            <Badge variant="secondary">
                                From: {filters.startDate}
                            </Badge>
                        )}
                        {filters.endDate && (
                            <Badge variant="secondary">
                                To: {filters.endDate}
                            </Badge>
                        )}
                        {filters.agency && filters.agency !== "ALL" && (
                            <Badge variant="secondary">
                                Agency: {filters.agency}
                            </Badge>
                        )}
                        {filters.bloodType && filters.bloodType !== "ALL" && (
                            <Badge variant="secondary">
                                Blood Type: {filters.bloodType}
                            </Badge>
                        )}
                    </div>
                    <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

// Individual Report Tab Components
const DonationSummaryTab = () => {
    const { filters, exportToPDF, isGenerating } = useReportContext();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.startDate)
                params.append("startDate", filters.startDate);
            if (filters.endDate) params.append("endDate", filters.endDate);
            if (filters.agency && filters.agency !== "ALL")
                params.append("agency", filters.agency);
            if (filters.bloodType && filters.bloodType !== "ALL")
                params.append("bloodType", filters.bloodType);

            const response = await fetch(
                `/api/reports/donation-summary?${params}`
            );
            const result = await response.json();

            if (result.success) {
                setData(result.data);
            } else {
                setError(result.error || "Failed to fetch data");
            }
        } catch (err) {
            setError("Network error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Donation Summary Report</CardTitle>
                <Button
                    onClick={() => exportToPDF("donation-summary")}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                >
                    {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                    Export PDF
                </Button>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading...
                    </div>
                )}

                {error && (
                    <div className="text-center py-8 text-red-500">
                        <p>Error: {error}</p>
                        <Button onClick={fetchData} className="mt-2">
                            Retry
                        </Button>
                    </div>
                )}

                {data && !loading && (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold">
                                        {data.summary.totalDonations || 0}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Total Donations
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold">
                                        {data.summary.totalVolume || 0}ml
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Total Volume
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold">
                                        {Math.round(
                                            data.summary.averageVolume || 0
                                        )}
                                        ml
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Average Volume
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold">
                                        {data.summary.uniqueDonors || 0}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Unique Donors
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Donations by Blood Type */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Donations by Blood Type</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Blood Type</TableHead>
                                            <TableHead>Count</TableHead>
                                            <TableHead>
                                                Total Volume (ml)
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.byBloodType?.map(
                                            (item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {item.bloodType}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.count}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.totalVolume}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                        {data.byBloodType?.length === 0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={3}
                                                    className="text-center"
                                                >
                                                    No data available
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const InventoryTab = () => {
    const { filters } = useReportContext();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.bloodType && filters.bloodType !== "ALL")
                params.append("bloodType", filters.bloodType);

            const response = await fetch(`/api/reports/inventory?${params}`);
            const result = await response.json();

            if (result.success) {
                setData(result.data);
            } else {
                setError(result.error || "Failed to fetch data");
            }
        } catch (err) {
            setError("Network error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    const getStatusColor = (status) => {
        switch (status) {
            case "Critical":
                return "text-red-600 bg-red-50";
            case "Low":
                return "text-yellow-600 bg-yellow-50";
            case "Good":
                return "text-green-600 bg-green-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Blood Type Inventory Report</CardTitle>
                <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                </Button>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading...
                    </div>
                )}

                {error && (
                    <div className="text-center py-8 text-red-500">
                        <p>Error: {error}</p>
                        <Button onClick={fetchData} className="mt-2">
                            Retry
                        </Button>
                    </div>
                )}

                {data && !loading && (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold">
                                        {data.summary.totalUnits}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Total Units Available
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold">
                                        {Math.round(data.summary.totalVolume)}ml
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Total Volume
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-red-600">
                                        {data.summary.criticalTypes}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Critical Types
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {data.summary.lowTypes}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Low Stock Types
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Inventory Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Current Inventory by Blood Type
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="overflow-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Blood Type</TableHead>
                                            <TableHead>
                                                Units Available
                                            </TableHead>
                                            <TableHead>
                                                Total Volume (ml)
                                            </TableHead>
                                            <TableHead>Days Coverage</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.inventory?.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">
                                                    {item.blood_type}
                                                </TableCell>
                                                <TableCell>
                                                    {item.unitsAvailable}
                                                </TableCell>
                                                <TableCell>
                                                    {Math.round(
                                                        item.totalCollected
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {item.daysCoverage}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={getStatusColor(
                                                            item.status
                                                        )}
                                                    >
                                                        {item.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const EventsTab = () => {
    const { filters, exportToPDF, isGenerating } = useReportContext();

    const fetchData = async () => {
        const params = new URLSearchParams();
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);
        if (filters.agency && filters.agency !== "ALL") {
            params.append("agency", filters.agency);
        }

        const res = await fetch(`/api/reports/event-performance?${params}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
            throw new Error(data.message || "Failed to fetch data");
        }
        return data.data;
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ["eventPerformance", filters],
        queryFn: fetchData,
    });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Event Performance Report</CardTitle>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToPDF("event-performance")}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4 mr-2" />
                    )}
                    Export PDF
                </Button>
            </CardHeader>
            <CardContent className="overflow-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">
                        <p>Error: {error.message}</p>
                    </div>
                ) : data && data.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Agency</TableHead>
                                <TableHead className="text-center">
                                    Registered
                                </TableHead>
                                <TableHead className="text-center">
                                    Screened
                                </TableHead>
                                <TableHead className="text-center">
                                    Collected
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">
                                        {event.title}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            event.date
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{event.agency.name}</TableCell>
                                    <TableCell className="text-center">
                                        {event.registeredDonors}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {event.screenedDonors}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {event.collectedDonors}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>
                            No event performance data available for the selected
                            filters.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const DonorsTab = () => {
    const { filters, exportToPDF, isGenerating } = useReportContext();

    const fetchData = async () => {
        const params = new URLSearchParams();
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);

        const res = await fetch(`/api/reports/active-donors?${params}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
            throw new Error(data.message || "Failed to fetch data");
        }
        return data.data;
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ["activeDonors", filters.startDate, filters.endDate],
        queryFn: fetchData,
    });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Active Donors Report</CardTitle>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToPDF("active-donors")}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4 mr-2" />
                    )}
                    Export PDF
                </Button>
            </CardHeader>
            <CardContent className="overflow-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">
                        <p>Error: {error.message}</p>
                    </div>
                ) : data && data.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Contact No.</TableHead>
                                <TableHead>Blood Type</TableHead>
                                <TableHead>Agency</TableHead>
                                <TableHead>Last Donation</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((donor) => (
                                <TableRow key={donor.id}>
                                    <TableCell className="font-medium">
                                        {donor.name}
                                    </TableCell>
                                    <TableCell>{donor.email}</TableCell>
                                    <TableCell>
                                        +63{donor.contact_number}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {donor?.blood_type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {donor?.agency}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            donor.lastDonationDate
                                        ).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>No active donors found for the selected period.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const AgenciesTab = () => {
    const { filters, exportToPDF, isGenerating } = useReportContext();

    const fetchData = async () => {
        const params = new URLSearchParams();
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);

        const res = await fetch(`/api/reports/agency-contribution?${params}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
            throw new Error(data.message || "Failed to fetch data");
        }
        return data.data;
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ["agencyContribution", filters.startDate, filters.endDate],
        queryFn: fetchData,
    });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Agency Contribution Report</CardTitle>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToPDF("agency-contribution")}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4 mr-2" />
                    )}
                    Export PDF
                </Button>
            </CardHeader>
            <CardContent className="overflow-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">
                        <p>Error: {error.message}</p>
                    </div>
                ) : data && data.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Agency Name</TableHead>
                                <TableHead className="text-center">
                                    Total Events
                                </TableHead>
                                <TableHead className="text-center">
                                    Total Collections
                                </TableHead>
                                <TableHead className="text-center">
                                    Total Volume (ml)
                                </TableHead>
                                <TableHead className="text-center">
                                    Avg. Donors / Event
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((agency) => (
                                <TableRow key={agency.id}>
                                    <TableCell className="font-medium">
                                        {agency.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {agency.totalEvents}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {parseInt(
                                            agency.totalCollections,
                                            10
                                        ) || 0}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {parseInt(
                                            agency.totalVolumeCollected,
                                            10
                                        ) || 0}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {parseFloat(
                                            agency.avgDonorsPerEvent || 0
                                        ).toFixed(1) || 0}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>
                            No agency contribution data available for the
                            selected filters.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const AuditTab = () => {
    const { filters } = useReportContext();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Audit Trail Report</CardTitle>
                <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                </Button>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8 text-gray-500">
                    <p>Audit trail data will be displayed here</p>
                    <p className="text-sm mt-2">
                        Filters applied: {JSON.stringify(filters, null, 2)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

const ContactTab = () => {
    const { filters } = useReportContext();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Contact Form Submissions Report</CardTitle>
                <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                </Button>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8 text-gray-500">
                    <p>Contact form submissions data will be displayed here</p>
                    <p className="text-sm mt-2">
                        Filters applied: {JSON.stringify(filters, null, 2)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

// Main Reports Page Component
export default function ReportsPage() {
    return (
        <ReportProvider>
            <div className="container mx-auto p-1 not-last:md:p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Admin Reports
                    </h1>
                    <p className="text-gray-600 mt-2 dark:text-gray-400">
                        Generate and export comprehensive reports for blood
                        donation activities
                    </p>
                </div>

                <FilterBar />

                <Tabs defaultValue="donation" className="w-full">
                    <TabsList className="flex w-full overflow-auto h-auto p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <TabsTrigger
                            value="donation"
                            className="flex items-center gap-2 px-4 py-3 rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-blue-200 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-blue-400 dark:data-[state=inactive]:text-gray-400 dark:data-[state=inactive]:hover:text-gray-200 dark:data-[state=inactive]:hover:bg-gray-700"
                        >
                            <Heart className="h-4 w-4" />
                            <span className="font-medium">Donation</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="inventory"
                            className="flex items-center gap-2 px-4 py-3 rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-blue-200 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-blue-400 dark:data-[state=inactive]:text-gray-400 dark:data-[state=inactive]:hover:text-gray-200 dark:data-[state=inactive]:hover:bg-gray-700"
                        >
                            <Package className="h-4 w-4" />
                            <span className="font-medium">Inventory</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="events"
                            className="flex items-center gap-2 px-4 py-3 rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-blue-200 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-blue-400 dark:data-[state=inactive]:text-gray-400 dark:data-[state=inactive]:hover:text-gray-200 dark:data-[state=inactive]:hover:bg-gray-700"
                        >
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">Events</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="donors"
                            className="flex items-center gap-2 px-4 py-3 rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-blue-200 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-blue-400 dark:data-[state=inactive]:text-gray-400 dark:data-[state=inactive]:hover:text-gray-200 dark:data-[state=inactive]:hover:bg-gray-700"
                        >
                            <Users className="h-4 w-4" />
                            <span className="font-medium">Donors</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="agencies"
                            className="flex items-center gap-2 px-4 py-3 rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-blue-200 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-blue-400 dark:data-[state=inactive]:text-gray-400 dark:data-[state=inactive]:hover:text-gray-200 dark:data-[state=inactive]:hover:bg-gray-700"
                        >
                            <Building2 className="h-4 w-4" />
                            <span className="font-medium">Agencies</span>
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-6">
                        <TabsContent value="donation">
                            <DonationSummaryTab />
                        </TabsContent>

                        <TabsContent value="inventory">
                            <InventoryTab />
                        </TabsContent>

                        <TabsContent value="events">
                            <EventsTab />
                        </TabsContent>

                        <TabsContent value="donors">
                            <DonorsTab />
                        </TabsContent>

                        <TabsContent value="agencies">
                            <AgenciesTab />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </ReportProvider>
    );
}
