"use client";

import DateRangePickerComponent from "@components/reusable_components/DateRangePickerComponent";
import { Calendar, Filter } from "lucide-react";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { fetchReports } from "./action";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { exportToExcel } from "@lib/export-to-excel";
import { getMedicationErrorReportHtml } from "@lib/pdf-html-template/getPdfHtmlTemplate";

export default function GenerateReport({
    data,
    onLoad,
    onDataChange,
    visibleData,
}) {
    const searchParams = useSearchParams();
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");

    // console.log("current visibleData", visibleData);

    const [htmlReport, setHtmlReport] = useState();
    const [isGenerating, setIsGenerating] = useState();
    const [dateRange, setDateRange] = useState([
        {
            startDate: start_date
                ? moment(start_date, "YYYY-MM-DD").toDate()
                : moment().startOf("month").toDate(),
            endDate: end_date
                ? moment(end_date, "YYYY-MM-DD").toDate()
                : moment().toDate(),
            key: "selection",
        },
    ]);
    const prevStart = useRef({
        start: moment(dateRange[0].startDate).format("YYYY-MM-DD"),
        end: moment(dateRange[0].endDate).format("YYYY-MM-DD"),
    });

    function handleDateRangeChange(ranges) {
        setDateRange([ranges.selection]);
    }

    useEffect(() => {
        // console.log("data", data);
        const start_date = moment(dateRange[0].startDate).format("MMMM DD - ");
        const end_date = moment(dateRange[0].endDate).format("MMMM DD, YYYY");

        const reports = data.map((row) => ({
            ...row,
            error_type_name:
                row.error_type?.name == "Others"
                    ? `${row.error_type?.name} (${row.other_error_type})`
                    : row.error_type?.name,
        }));

        const htmls = getMedicationErrorReportHtml(
            reports,
            `Medication Error Summary Report (${start_date}${end_date})`
        );

        setHtmlReport(htmls);
    }, [data]);

    useEffect(() => {
        const start = moment(dateRange[0].startDate).format("YYYY-MM-DD");
        const end = moment(dateRange[0].endDate).format("YYYY-MM-DD");

        if (
            prevStart.current?.start == start &&
            prevStart.current?.end == end
        ) {
            // console.log("skipppppppppppp", prevStart.current);
            return;
        }

        prevStart.current = start;

        // console.log("filterringggggggggggggggg");

        onLoad();
        const filterReports = async () => {
            const res = await fetchReports(start, end);
            const json = await res;
            // console.log("json>>>>>>>>>>>>>", json);
            const { success } = json;

            if (success) {
                onDataChange(json.reports);
            }
        };

        filterReports();
    }, [dateRange]);

    const handleExport = (exportData) => {
        exportToExcel(exportData, "INMERS_Report");
    };

    const generateReport = async () => {
        setIsGenerating(true);
        const res = await fetch("/api/generate-pdf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ html: htmlReport }),
        });

        if (!res.ok) {
            console.error(`Failed to generate PDF: ${res.statusText}`);
            return;
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "generated.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setIsGenerating(false);
    };

    return (
        <div className="flex items-center justify-end gap-1">
            <form className="flex justify-end items-center">
                {/* Input field to display selected date range */}
                <Calendar className="mr-1" />
                <DateRangePickerComponent
                    state={dateRange}
                    handleSelect={handleDateRangeChange}
                />
            </form>

            <button
                onClick={generateReport}
                className="btn btn-neutral hover:bg-neutral-800 hover:text-green-300"
            >
                {isGenerating ? (
                    <>
                        <span className="loading loading-bars loading-xs"></span>
                        Generating...
                    </>
                ) : (
                    <>
                        <FaFilePdf />
                        Export
                    </>
                )}
            </button>
            <button
                onClick={() => handleExport(visibleData)}
                className="btn btn-neutral hover:bg-neutral-800 hover:text-green-300"
            >
                {/* {isGenerating ? (
                    <>
                        <span className="loading loading-bars loading-xs"></span>
                        Generating...
                    </>
                ) : ( */}
                <>
                    <FaFileExcel />
                    Excel
                </>
                {/* )} */}
            </button>
        </div>
    );
}
