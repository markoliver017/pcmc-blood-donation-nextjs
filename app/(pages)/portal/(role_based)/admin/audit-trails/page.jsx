"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAuditTrails } from "@/action/auditTrailAction";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import LoadingModal from "@components/layout/LoadingModal";
import notify from "@components/ui/notify";
import Skeleton from "@components/ui/skeleton";
import AuditTrailFilters from "@components/admin/audit-trails/AuditTrailFilters";
import AuditTrailPagination from "@components/admin/audit-trails/AuditTrailPagination";
import AuditTrailDetailModal from "@components/admin/audit-trails/AuditTrailDetailModal";
import { Button } from "@components/ui/button";
import { Eye } from "lucide-react";
import Skeleton_line from "@components/ui/skeleton_line";

export default function AuditTrailsPage() {
    // Pagination and filters state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [filters, setFilters] = useState({});
    const [search, setSearch] = useState("");
    const [selectedAuditTrailId, setSelectedAuditTrailId] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Fetch audit trails
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["audit-trails", page, pageSize, filters, search],
        queryFn: () => fetchAuditTrails({ page, pageSize, filters, search }),
        keepPreviousData: true,
    });

    // Error notification
    if (isError && error?.message) {
        notify({ error: true, message: error.message });
    }

    // Handle filter changes
    const handleFiltersChange = useCallback((newFilters) => {
        setFilters(newFilters);
        setPage(1); // Reset to first page when filters change
    }, []);

    // Handle search changes
    const handleSearchChange = useCallback((newSearch) => {
        setSearch(newSearch);
        setPage(1); // Reset to first page when search changes
    }, []);

    // Handle page changes
    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
    }, []);

    // Handle page size changes
    const handlePageSizeChange = useCallback((newPageSize) => {
        setPageSize(newPageSize);
        setPage(1); // Reset to first page when page size changes
    }, []);

    // Handle detail modal
    const handleViewDetails = useCallback((auditTrailId) => {
        setSelectedAuditTrailId(auditTrailId);
        setIsDetailModalOpen(true);
    }, []);

    const handleCloseDetailModal = useCallback(() => {
        setIsDetailModalOpen(false);
        setSelectedAuditTrailId(null);
    }, []);

    // Calculate total pages
    const totalPages = data?.success ? Math.ceil(data.total / pageSize) : 0;

    return (
        <div className="container mx-auto py-8">
            {/* Filters Component */}
            <AuditTrailFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSearchChange={handleSearchChange}
                search={search}
                isLoading={isLoading}
            />

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Audit Trails
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Loading State */}
                    {/* <LoadingModal isLoading={isLoading} /> */}

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Date/Time
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Controller
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Action
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Error
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Details
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        IP
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        User Agent
                                    </th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                            </thead>
                            {isLoading && !data ? (
                                <tbody>
                                    <tr>
                                        <td colSpan={9} className="text-center py-8 text-gray-400">
                                            <Skeleton_line />
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                            <tbody>
                                {data?.success && data.data.length > 0 ? (
                                    data.data.map((log) => (
                                        <tr
                                            key={log.id}
                                            className={
                                                log.is_error
                                                    ? "bg-red-50 dark:bg-red-900/20"
                                                    : ""
                                            }
                                        >
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {new Date(
                                                    log.createdAt
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                                                {log.user
                                                    ? `${
                                                          log.user.first_name ||
                                                          ""
                                                      } ${
                                                          log.user.last_name ||
                                                          ""
                                                      } (${log.user.email})`
                                                    : "-"}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                                                {log.controller}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                                                {log.action}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-center">
                                                {log.is_error ? (
                                                    <span className="text-red-600 font-bold">
                                                        Yes
                                                    </span>
                                                ) : (
                                                    <span className="text-green-600">
                                                        No
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600 dark:text-gray-300 max-w-xs truncate">
                                                {log.details?.slice(0, 60) ||
                                                    "-"}
                                                {log.details &&
                                                log.details.length > 60
                                                    ? "..."
                                                    : ""}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600 dark:text-gray-300">
                                                {log.ip_address || "-"}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600 dark:text-gray-300 max-w-xs truncate">
                                                {log.user_agent?.slice(0, 40) ||
                                                    "-"}
                                                {log.user_agent &&
                                                log.user_agent.length > 40
                                                    ? "..."
                                                    : ""}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(log.id)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="text-center py-8 text-gray-400"
                                        >
                                            {isLoading
                                                ? "Loading..."
                                                : "No audit trails found."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            )}
                        </table>
                    </div>

                    {/* Pagination */}
                    {data?.success && data.data.length > 0 && (
                        <AuditTrailPagination
                            currentPage={page}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalItems={data.total}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                            isLoading={isLoading}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Details Modal */}
            <AuditTrailDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                auditTrailId={selectedAuditTrailId}
            />
        </div>
    );
}
