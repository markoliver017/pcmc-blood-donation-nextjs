"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, Filter, Loader2 } from "lucide-react";
import { getAllAgencyOptions } from "@/action/adminEventAction";
import { useReportContext } from "@components/reports/ReportContext";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
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
import { Badge } from "@components/ui/badge";

const FilterBar = () => {
    const { filters, updateFilter, clearFilters } = useReportContext();

    const {
        data: agencies,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["agencies"],
        queryFn: async () => {
            const res = await getAllAgencyOptions();
            if (!res.success) throw res;
            return res.data;
        },
    });

    if (isLoading) return <Loader2 className="animate-spin" />;
    if (isError) return null;

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" /> Report Filters
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Start Date */}
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
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    {/* End Date */}
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
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    {/* Agency */}
                    <div className="space-y-2">
                        <Label htmlFor="agency">Agency</Label>
                        <Select
                            value={filters.agency}
                            onValueChange={(value) => updateFilter("agency", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Agency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Agencies</SelectItem>
                                {agencies?.map((agency) => (
                                    <SelectItem key={agency.id} value={agency.id}>
                                        {agency.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Blood Type */}
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
                                {[
                                    "A +",
                                    "A -",
                                    "B +",
                                    "B -",
                                    "AB +",
                                    "AB -",
                                    "O +",
                                    "O -",
                                ].map((bt) => (
                                    <SelectItem key={bt} value={bt}>
                                        {bt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Active Filter Badges */}
                <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2 flex-wrap">
                        {filters.startDate && (
                            <Badge variant="secondary">From: {filters.startDate}</Badge>
                        )}
                        {filters.endDate && (
                            <Badge variant="secondary">To: {filters.endDate}</Badge>
                        )}
                        {filters.agency && filters.agency !== "ALL" && (
                            <Badge variant="secondary">Agency: {filters.agency}</Badge>
                        )}
                        {filters.bloodType && filters.bloodType !== "ALL" && (
                            <Badge variant="secondary">Blood Type: {filters.bloodType}</Badge>
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

export default FilterBar;
