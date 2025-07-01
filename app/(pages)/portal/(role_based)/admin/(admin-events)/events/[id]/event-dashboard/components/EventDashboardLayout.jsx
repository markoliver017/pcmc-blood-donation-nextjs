"use client";
import React from "react";
import { Card, CardContent } from "@components/ui/card";
import EventDashboardHeader from "./EventDashboardHeader";
import EventStatisticsCards from "./EventStatisticsCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import PendingDonorsList from "./PendingDonorsList";
import ExaminedDonorsList from "./ExaminedDonorsList";
import CollectedDonorsList from "./CollectedDonorsList";
import DeferredDonorsList from "./DeferredDonorsList";
import EventDashboardDataTable from "./EventDashboardDataTable";

export default function EventDashboardLayout({
    event,
    activeTab,
    onTabChange,
    tabData,
    onRefresh,
    isRefreshing,
    lastUpdated,
    onBack,
    children,
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header with navigation and refresh */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Event Dashboard
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {event?.title || "Loading..."}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onRefresh}
                                disabled={isRefreshing}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <svg
                                    className={`w-5 h-5 ${
                                        isRefreshing ? "animate-spin" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                            </button>
                            {lastUpdated && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Updated: {lastUpdated.toLocaleTimeString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-2">
                {/* Event Dashboard Header */}
                <EventDashboardHeader event={event} />

                {/* Tab Navigation */}
                <div className="mt-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="px-6">
                        <div className="flex space-x-1 overflow-x-auto">
                            {Object.entries(tabData).map(([key, tab]) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => onTabChange(key)}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                                            activeTab === key
                                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="hidden sm:inline">
                                            {tab.label}
                                        </span>
                                        {tab.count > 0 && (
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    activeTab === key
                                                        ? "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                                                        : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                                }`}
                                            >
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}
