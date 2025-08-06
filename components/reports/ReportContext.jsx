"use client";
import React, { createContext, useContext, useState } from "react";

// Report Context for managing filters across tabs
const ReportContext = createContext();

export const useReportContext = () => {
    const context = useContext(ReportContext);
    if (!context) {
        throw new Error("useReportContext must be used within a ReportProvider");
    }
    return context;
};

export const ReportProvider = ({ children }) => {
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
            if (filters.startDate) params.append("startDate", filters.startDate);
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
            link.download = `${reportType}-report-${new Date()
                .toISOString()
                .split("T")[0]}.pdf`;
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
