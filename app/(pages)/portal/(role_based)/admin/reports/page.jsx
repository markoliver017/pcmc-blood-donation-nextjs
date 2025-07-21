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
import { CalendarIcon, Download, Filter, Loader2 } from "lucide-react";
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
                            <CardContent>
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
    const { filters } = useReportContext();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Event Performance Report</CardTitle>
                <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                </Button>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8 text-gray-500">
                    <p>Event performance data will be displayed here</p>
                    <p className="text-sm mt-2">
                        Filters applied: {JSON.stringify(filters, null, 2)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

const DonorsTab = () => {
    const { filters } = useReportContext();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Active Donor List Report</CardTitle>
                <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                </Button>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8 text-gray-500">
                    <p>Active donor list data will be displayed here</p>
                    <p className="text-sm mt-2">
                        Filters applied: {JSON.stringify(filters, null, 2)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

const AgenciesTab = () => {
    const { filters } = useReportContext();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Agency Contribution Report</CardTitle>
                <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                </Button>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8 text-gray-500">
                    <p>Agency contribution data will be displayed here</p>
                    <p className="text-sm mt-2">
                        Filters applied: {JSON.stringify(filters, null, 2)}
                    </p>
                </div>
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
            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Admin Reports
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Generate and export comprehensive reports for blood
                        donation activities
                    </p>
                </div>

                <FilterBar />

                <Tabs defaultValue="donation" className="w-full">
                    <TabsList className="grid w-full grid-cols-7">
                        <TabsTrigger value="donation">Donation</TabsTrigger>
                        <TabsTrigger value="inventory">Inventory</TabsTrigger>
                        <TabsTrigger value="events">Events</TabsTrigger>
                        <TabsTrigger value="donors">Donors</TabsTrigger>
                        <TabsTrigger value="agencies">Agencies</TabsTrigger>
                        <TabsTrigger value="audit">Audit</TabsTrigger>
                        <TabsTrigger value="contact">Contact</TabsTrigger>
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

                        <TabsContent value="audit">
                            <AuditTab />
                        </TabsContent>

                        <TabsContent value="contact">
                            <ContactTab />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </ReportProvider>
    );
}
