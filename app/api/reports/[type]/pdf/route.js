import { NextResponse } from "next/server";
import { reportToHtml } from "@lib/reportToHtml";

/**
 * GET /api/reports/:type/pdf
 * Generates PDF for specified report type with given parameters
 * Supports: donation-summary, inventory
 */
export async function GET(request, { params }) {
    try {
        const { type } = params;
        const { searchParams } = new URL(request.url);

        // Extract filter parameters
        const filters = {
            startDate: searchParams.get("startDate"),
            endDate: searchParams.get("endDate"),
            agency: searchParams.get("agency"),
            bloodType: searchParams.get("bloodType"),
        };

        console.log("filters>>>>>>", filters);
        // Fetch the same data that the UI would use
        let reportData;
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

        try {
            // Build query string for API call
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== "ALL") {
                    queryParams.append(key, value);
                }
            });

            const apiUrl = `${baseUrl}/api/reports/${type}?${queryParams.toString()}`;
            const response = await fetch(apiUrl, {
                headers: {
                    Cookie: request.headers.get("Cookie") || "",
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch report data: ${response.status}`
                );
            }

            reportData = await response.json();
        } catch (error) {
            console.error("Error fetching report data:", error);
            return NextResponse.json(
                { error: "Failed to fetch report data" },
                { status: 500 }
            );
        }

        console.log("reportData", reportData);

        // Generate HTML using reportToHtml helper
        const html = reportToHtml(type, {
            data: reportData.data,
            filters,
            generatedAt: new Date().toISOString(),
        });

        // Call the existing PDF generation service
        const pdfResponse = await fetch(`${baseUrl}/api/generate-pdf`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ html }),
        });

        if (!pdfResponse.ok) {
            throw new Error(`PDF generation failed: ${pdfResponse.status}`);
        }

        const pdfBuffer = await pdfResponse.arrayBuffer();

        // Generate filename based on report type and current date
        const timestamp = new Date().toISOString().split("T")[0];
        const filename = `${type}-report-${timestamp}.pdf`;

        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
                Expires: "0",
            },
        });
    } catch (error) {
        console.error("PDF generation error:", error);
        return NextResponse.json(
            {
                error: "PDF generation failed",
                message: error.message,
            },
            { status: 500 }
        );
    }
}
