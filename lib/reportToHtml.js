// Removed react-dom/server import to fix Next.js App Router compatibility
// Now generating HTML directly without React component rendering

import { safeFormatDate } from "./utils/date.utils";

/**
 * Generic helper to generate report HTML string for PDF generation
 * @param {string} type - Report type (donation-summary, inventory, etc.)
 * @param {Object} params - Report parameters (filters, data, etc.)
 * @returns {string} HTML string ready for PDF conversion
 */

export function reportToHtml(type, params) {
    let title;
    let reportHtml;

    switch (type) {
        case "donation-summary":
            title = "Donation Summary Report";
            reportHtml = generateDonationSummaryHtml(params);
            break;
        case "inventory":
            title = "Blood Inventory Report";
            reportHtml = generateInventoryReportHtml(params);
            break;
        case "event-performance":
            title = "Event Performance Report";
            reportHtml = generateEventPerformanceReportHtml(params);
            break;
        case "active-donors":
            title = "Active Donors Report";
            reportHtml = generateActiveDonorsReportHtml(params);
            break;
        case "agency-contribution":
            title = "Agency Contribution Report";
            reportHtml = generateAgencyContributionReportHtml(params);
            break;
        default:
            throw new Error(`Unsupported report type: ${type}`);
    }

    // Wrap in complete HTML document with PDF-friendly styling
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: white;
        }
        
        .report-container {
            max-width: 100%;
            margin: 0 auto;
            padding: 20px;
        }
        
        .report-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #dc2626;
            padding-bottom: 15px;
        }
        
        .report-title {
            font-size: 24px;
            font-weight: bold;
            color: #dc2626;
            margin-bottom: 5px;
        }
        
        .report-subtitle {
            font-size: 14px;
            color: #666;
        }
        
        .filters-section {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
        }
        
        .filters-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #374151;
        }
        
        .filter-item {
            display: inline-block;
            margin-right: 20px;
            margin-bottom: 5px;
        }
        
        .filter-label {
            font-weight: 500;
            color: #4b5563;
        }
        
        .filter-value {
            color: #111827;
        }
        
        .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 25px;
        }
        
        .summary-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
        }
        
        .summary-card-title {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }
        
        .summary-card-value {
            font-size: 20px;
            font-weight: bold;
            color: #111827;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            font-size: 11px;
        }
        
        .data-table th,
        .data-table td {
            padding: 8px 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .data-table th {
            background: #f9fafb;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #d1d5db;
        }
        
        .data-table tr:nth-child(even) {
            background: #f9fafb;
        }
        
        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 500;
            text-transform: uppercase;
        }
        
        .status-available {
            background: #dcfce7;
            color: #166534;
        }
        
        .status-low {
            background: #fef3c7;
            color: #92400e;
        }
        
        .status-critical {
            background: #fee2e2;
            color: #991b1b;
        }
        
        .text-center {
            text-align: center;
        }
        
        .text-right {
            text-align: right;
        }
        
        .font-medium {
            font-weight: 500;
        }
        
        .text-muted {
            color: #6b7280;
        }
        
        @media print {
            body {
                font-size: 11px;
            }
            
            .report-container {
                padding: 10px;
            }
            
            .summary-cards {
                grid-template-columns: repeat(4, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="report-container">
        ${reportHtml}
    </div>
</body>
</html>`;
}

/**
 * Generate HTML for donation summary report
 */
function generateDonationSummaryHtml(params) {
    const { data, filters, generatedAt } = params;
    console.log("data>>>>", data);
    const { summary = {}, byBloodType: donations = [] } = data || {};

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatFilters = () => {
        const filterItems = [];
        if (filters.startDate)
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">From:</span> <span class="filter-value">${formatDate(
                    filters.startDate
                )}</span></span>`
            );
        if (filters.endDate)
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">To:</span> <span class="filter-value">${formatDate(
                    filters.endDate
                )}</span></span>`
            );
        if (filters.agency && filters.agency !== "ALL")
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">Agency:</span> <span class="filter-value">${filters.agency}</span></span>`
            );
        if (filters.bloodType && filters.bloodType !== "ALL")
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">Blood Type:</span> <span class="filter-value">${filters.bloodType}</span></span>`
            );
        return filterItems.join("");
    };

    return `
        <div class="report-header">
            <h1 class="report-title">Donation Summary Report</h1>
            <p class="report-subtitle">Generated on ${formatDate(
                generatedAt
            )}</p>
        </div>
        
        <div class="filters-section">
            <div class="filters-title">Report Filters</div>
            ${formatFilters()}
        </div>
        
        <div class="summary-cards">
            <div class="summary-card">
                <div class="summary-card-title">Total Donations</div>
                <div class="summary-card-value">${
                    summary.totalDonations || 0
                }</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-title">Total Volume</div>
                <div class="summary-card-value">${
                    summary.totalVolume || 0
                }</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-title">Unique Donors</div>
                <div class="summary-card-value">${
                    summary.uniqueDonors || 0
                }</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-title">Unique Donors</div>
                <div class="summary-card-value">${
                    summary.uniqueDonors || 0
                }</div>
            </div>
        </div>
        <h3>Donations By Blood Type</h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Blood Type</th>
                    <th>Count</th>
                    <th>Total Volume (ml)</th>
                </tr>
            </thead>
            <tbody>
                ${donations
                    .map(
                        (donation) => `
                    <tr>
                        <td>${donation.bloodType || "N/A"}</td>
                        <td>${donation.count || 0}</td>
                        <td class="text-center font-medium">${
                            donation.totalVolume || "N/A"
                        }</td>
                    </tr>
                `
                    )
                    .join("")}
            </tbody>
        </table>
    `;
}

/**
 * Generate HTML for inventory report
 */
function generateInventoryReportHtml(params) {
    const { data, filters, generatedAt } = params;
    const { summary = {}, inventory = [] } = data || {};

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatFilters = () => {
        const filterItems = [];
        if (filters.agency && filters.agency !== "ALL")
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">Agency:</span> <span class="filter-value">${filters.agency}</span></span>`
            );
        if (filters.bloodType && filters.bloodType !== "ALL")
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">Blood Type:</span> <span class="filter-value">${filters.bloodType}</span></span>`
            );
        return filterItems.join("");
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "low":
                return "status-low";
            case "critical":
                return "status-critical";
            default:
                return "status-available";
        }
    };

    return `
        <div class="report-header">
            <h1 class="report-title">Blood Inventory Report</h1>
            <p class="report-subtitle">Generated on ${formatDate(
                generatedAt
            )}</p>
        </div>
        
        <div class="filters-section">
            <div class="filters-title">Report Filters</div>
            ${formatFilters()}
        </div>
        
        <div class="summary-cards">
            <div class="summary-card">
                <div class="summary-card-title">Total Units</div>
                <div class="summary-card-value">${summary.totalUnits || 0}</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-title">Available Units</div>
                <div class="summary-card-value">${
                    summary.availableUnits || 0
                }</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-title">Low Stock Items</div>
                <div class="summary-card-value">${
                    summary.lowStockItems || 0
                }</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-title">Critical Items</div>
                <div class="summary-card-value">${
                    summary.criticalItems || 0
                }</div>
            </div>
        </div>
        
        <table class="data-table">
            <thead>
                <tr>
                    <th>Blood Type</th>
                    <th>Agency</th>
                    <th>Available Units</th>
                    <th>Reserved Units</th>
                    <th>Expired Units</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                </tr>
            </thead>
            <tbody>
                ${inventory
                    .map(
                        (item) => `
                    <tr>
                        <td class="text-center font-medium">${
                            item.bloodType || "N/A"
                        }</td>
                        <td>${item.agency || "N/A"}</td>
                        <td class="text-center">${item.availableUnits || 0}</td>
                        <td class="text-center">${item.reservedUnits || 0}</td>
                        <td class="text-center">${item.expiredUnits || 0}</td>
                        <td><span class="status-badge ${getStatusClass(
                            item.status
                        )}">${item.status || "Available"}</span></td>
                        <td class="text-muted">${formatDate(
                            item.lastUpdated
                        )}</td>
                    </tr>
                `
                    )
                    .join("")}
            </tbody>
        </table>
    `;
}

function generateEventPerformanceReportHtml(params) {
    const { data: events, filters, generatedAt } = params;

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatFilters = () => {
        const filterItems = [];
        if (filters.startDate)
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">From:</span> <span class="filter-value">${formatDate(
                    filters.startDate
                )}</span></span>`
            );
        if (filters.endDate)
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">To:</span> <span class="filter-value">${formatDate(
                    filters.endDate
                )}</span></span>`
            );
        if (filters.agency && filters.agency !== "ALL")
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">Agency:</span> <span class="filter-value">${filters.agency}</span></span>`
            );
        if (filters.bloodType && filters.bloodType !== "ALL")
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">Blood Type:</span> <span class="filter-value">${filters.bloodType}</span></span>`
            );
        return filterItems.join("");
    };

    return `
        <div class="report-header">
            <h1 class="report-title">Event Performance Report</h1>
            <p class="report-subtitle">Generated on ${formatDate(
                generatedAt
            )}</p>
        </div>
        
        <div class="filters-section">
            <div class="filters-title">Report Filters</div>
            ${formatFilters()}
        </div>
        <h3>Event Performance</h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Event Name</th>
                    <th>Date</th>
                    <th>Agency</th>
                    <th>Registered</th>
                    <th>Screened</th>
                    <th>Collected</th>
                </tr>
            </thead>
            <tbody>
                ${events
                    .map(
                        (item) => `
                    <tr>
                        <td class="text-center font-medium">${
                            item.title || "N/A"
                        }</td>
                        <td>${item.date || "N/A"}</td>
                        <td class="text-center">${item?.agency?.name || 0}</td>
                        <td class="text-center">${
                            item.registeredDonors || 0
                        }</td>
                        <td class="text-center">${item.screenedDonors || 0}</td>
                        <td class="text-center">${
                            item.collectedDonors || 0
                        }</td>
                    </tr>
                `
                    )
                    .join("")}
            </tbody>
        </table>
    `;
}

function generateActiveDonorsReportHtml(params) {
    const { data: donors, filters, generatedAt } = params;

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatFilters = () => {
        const filterItems = [];
        if (filters.startDate)
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">From:</span> <span class="filter-value">${formatDate(
                    filters.startDate
                )}</span></span>`
            );
        if (filters.endDate)
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">To:</span> <span class="filter-value">${formatDate(
                    filters.endDate
                )}</span></span>`
            );
        if (filters.agency && filters.agency !== "ALL")
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">Agency:</span> <span class="filter-value">${filters.agency}</span></span>`
            );
        if (filters.bloodType && filters.bloodType !== "ALL")
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">Blood Type:</span> <span class="filter-value">${filters.bloodType}</span></span>`
            );
        return filterItems.join("");
    };

    return `
        <div class="report-header">
            <h1 class="report-title">Event Performance Report</h1>
            <p class="report-subtitle">Generated on ${formatDate(
                generatedAt
            )}</p>
        </div>
        
        <div class="filters-section">
            <div class="filters-title">Report Filters</div>
            ${formatFilters()}
        </div>
        <h3>Event Performance</h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact No</th>
                    <th>Blood Type</th>
                    <th>Agency</th>
                    <th>Last Donation Date</th>
                </tr>
            </thead>
            <tbody>
                ${donors
                    .map(
                        (item) => `
                    <tr>
                        <td class="text-center font-medium">${
                            item.name || "N/A"
                        }</td>
                        <td>${item.email || "N/A"}</td>
                        <td class="text-center">+63${
                            item.contact_number || "N/A"
                        }</td>
                            <td class="text-center">${
                                item?.blood_type || "N/A"
                            }</td>
                        <td class="text-center">${item?.agency || "N/A"}</td>
                        <td class="text-center">${
                            safeFormatDate(item.lastDonationDate) || "N/A"
                        }</td>
                    </tr>
                `
                    )
                    .join("")}
            </tbody>
        </table>
    `;
}

function generateAgencyContributionReportHtml(params) {
    const { data: agencies, filters, generatedAt } = params;

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatFilters = () => {
        const filterItems = [];
        if (filters.startDate)
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">From:</span> <span class="filter-value">${formatDate(
                    filters.startDate
                )}</span></span>`
            );
        if (filters.endDate)
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">To:</span> <span class="filter-value">${formatDate(
                    filters.endDate
                )}</span></span>`
            );
        if (filters.agency && filters.agency !== "ALL")
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">Agency:</span> <span class="filter-value">${filters.agency}</span></span>`
            );
        if (filters.bloodType && filters.bloodType !== "ALL")
            filterItems.push(
                `<span class="filter-item"><span class="filter-label">Blood Type:</span> <span class="filter-value">${filters.bloodType}</span></span>`
            );
        return filterItems.join("");
    };

    return `
        <div class="report-header">
            <h1 class="report-title">Agency Contribution Report</h1>
            <p class="report-subtitle">Generated on ${formatDate(
                generatedAt
            )}</p>
        </div>
        
        <div class="filters-section">
            <div class="filters-title">Report Filters</div>
            ${formatFilters()}
        </div>
        <h3>Agency Contribution</h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Total Events</th>
                    <th>Total Volume</th>
                    <th>Average Donors / Event</th>
                </tr>
            </thead>
            <tbody>
                ${agencies
                    .map(
                        (item) => `
                    <tr>
                        <td class="text-center font-medium">${
                            item.name || "N/A"
                        }</td>
                        <td>${item.totalEvents || 0}</td>
                        <td>${item.totalVolumeCollected || 0}</td>
                        <td>${item?.avgDonorsPerEvent || 0}</td>
                    </tr>
                `
                    )
                    .join("")}
            </tbody>
        </table>
    `;
}
