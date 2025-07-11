"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAuditTrails } from "@/action/auditTrailAction";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import LoadingModal from "@components/layout/LoadingModal";
import notify from "@components/ui/notify";
import Skeleton from "@components/ui/skeleton";

export default function AuditTrailsPage() {
    // Pagination and filters state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    // TODO: Add filters/search state

    // Fetch audit trails
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["audit-trails", page, pageSize],
        queryFn: () => fetchAuditTrails({ page, pageSize }),
        keepPreviousData: true,
    });

    // Error notification
    if (isError && error?.message) {
        notify({ error: true, message: error.message });
    }

    if (isLoading) return <Skeleton />;

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Audit Trails
                    </CardTitle>
                    {/* TODO: Add AuditTrailFilters here */}
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
                                                {log.User
                                                    ? `${
                                                          log.User.first_name ||
                                                          ""
                                                      } ${
                                                          log.User.last_name ||
                                                          ""
                                                      } (${log.User.email})`
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
                                                {/* TODO: Add View Details button/modal */}
                                                <button className="btn btn-xs btn-outline">
                                                    View
                                                </button>
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
                        </table>
                    </div>
                    {/* TODO: Add pagination controls */}
                </CardContent>
            </Card>
        </div>
    );
}
