import moment from "moment";

export const getMedicationErrorReportHtml = (data, headerTitle) => {
    const reports = data.map((row) => ({
        ...row,
        error_type_name:
            row.error_type?.name == "Others"
                ? `${row.error_type?.name} (${row.other_error_type})`
                : row.error_type?.name,
    }));

    const htmls = `
            <!DOCTYPE html>
                <html lang='en'>
                <head>
                    <meta charset='UTF-8'>
                    <title>Integrated National Medication Error Reporting System (INMERS)  </title>
                    <script src='https://cdn.tailwindcss.com'></script>
                    <style>
                         html {
                            -webkit-print-color-adjust: exact;
                        }
                        body {
                            font-family: Arial, sans-serif;
                            margin: 10mm;
                        }
    
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            font-size: 0.875rem;
                        }
    
                        th, td {
                            border: 1px solid #ccc;
                            padding: 6px;
                            text-align: left;
                            vertical-align: top;
                        }
    
                        th {
                            background-color: #f3f4f6;
                        }
    
                        tr {
                            page-break-inside: avoid;
                        }
    
                        .report-title {
                            text-align: center;
                            margin-bottom: 20px;
                        }
    
                        .report-title h1 {
                            font-size: 1.5rem;
                            font-weight: bold;
                        }
    
                        .report-title h2 {
                            font-size: 1rem;
                            font-weight: normal;
                            color: #555;
                        }
    
                        .generated-date {
                            text-align: right;
                            font-size: 0.75rem;
                            color: #555;
                            margin-bottom: 10px;
                        }
    
                    </style>
                </head>
                <body>
    
                    <div class="report-title">
                        <h1>Integrated National Medication Error Reporting System (INMERS)</h1>
                        <h2>${headerTitle}</h2>
                    </div>
    
                    <div class="generated-date">
                        Generated on: ${moment().format("MMM. DD, YYYY")}
                    </div>
    
                    <table border="1" cellpadding="5" cellspacing="0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Report Date</th>
                                <th>Medication Error Date</th>
                                <th>Error Type</th>
                                <th>Patient Sex</th>
                                <th>Patient Weight</th>
                                <th>Patient Height</th>
                                <th>Exact Prescription</th>
                                <th>Incident Description</th>
                                <th>Workplace Environment</th>
                                <th>Immediate Actions</th>
                                <th>Corrective Actions</th>
                                <th>Preventive Actions</th>
                                <th>Medicine Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reports
                                .map(
                                    (row, i) => `
                                    <tr>
                                        <td>${i + 1}</td>
                                        <td>${moment(row.report_date).format(
                                            "MMM. DD, YYYY"
                                        )}</td>
                                        <td>${moment(row.error_date).format(
                                            "MMM. DD, YYYY"
                                        )}</td>
                                        <td>${row.error_type_name || ""}</td>
                                        <td>${row.patient_sex || ""}</td>
                                        <td>${row.patient_weight || ""}</td>
                                        <td>${row.patient_height || ""}</td>
                                        <td>${row.exact_prescription || ""}</td>
                                        <td>${
                                            row.incident_description || ""
                                        }</td>
                                        <td>${
                                            row.workplace_environment || ""
                                        }</td>
                                        <td>${row.immediate_actions || ""}</td>
                                        <td>${row.corrective_actions || ""}</td>
                                        <td>${row.preventive_actions || ""}</td>
                                        <td>${
                                            row.error_type.is_medicine_needed &&
                                            row.ReportMedicineRoutes.length > 0
                                                ? `
                                                <table class="table text-sm">
                                                    <thead>
                                                        <tr class="text-xs bg-gray-100">
                                                            <th>Generic Medicine</th>
                                                            <th>Route</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        ${row.ReportMedicineRoutes.map(
                                                            (med) => {
                                                                const genericLabel =
                                                                    med
                                                                        .GenericMedicine
                                                                        ?.name ||
                                                                    "N/A";
                                                                const routeLabel =
                                                                    med
                                                                        .RouteMedicine
                                                                        ?.name ||
                                                                    "N/A";

                                                                return `
                                                                <tr>
                                                                    <td>${genericLabel}</td>
                                                                    <td>${routeLabel}</td>
                                                                </tr>
                                                            `;
                                                            }
                                                        ).join("")}
                                                    </tbody>
                                                </table>
                                                `
                                                : "<span class='text-gray-400'>N/A</span>"
                                        }</td>
                                    </tr>
                                `
                                )
                                .join("")}
                        </tbody>
                    </table>
                </body>
            </html>
            `;

    return htmls;
};

export const getByDateMedicationErrorReportHtml = (
    data,
    start_date,
    end_date
) => {
    const reports = data.map((row) => ({
        ...row,
        error_type_name:
            row.error_type?.name == "Others"
                ? `${row.error_type?.name} (${row.other_error_type})`
                : row.error_type?.name,
    }));

    const htmls = `
            <!DOCTYPE html>
                <html lang='en'>
                <head>
                    <meta charset='UTF-8'>
                    <title>Integrated National Medication Error Reporting System (INMERS)  </title>
                    <script src='https://cdn.tailwindcss.com'></script>
                    <style>
                         html {
                            -webkit-print-color-adjust: exact;
                        }
                        body {
                            font-family: Arial, sans-serif;
                            margin: 10mm;
                        }
    
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            font-size: 0.875rem;
                        }
    
                        th, td {
                            border: 1px solid #ccc;
                            padding: 6px;
                            text-align: left;
                            vertical-align: top;
                        }
    
                        th {
                            background-color: #f3f4f6;
                        }
    
                        tr {
                            page-break-inside: avoid;
                        }
    
                        .report-title {
                            text-align: center;
                            margin-bottom: 20px;
                        }
    
                        .report-title h1 {
                            font-size: 1.5rem;
                            font-weight: bold;
                        }
    
                        .report-title h2 {
                            font-size: 1rem;
                            font-weight: normal;
                            color: #555;
                        }
    
                        .generated-date {
                            text-align: right;
                            font-size: 0.75rem;
                            color: #555;
                            margin-bottom: 10px;
                        }
    
                    </style>
                </head>
                <body>
    
                    <div class="report-title">
                        <h1>Integrated National Medication Error Reporting System (INMERS)</h1>
                        <h2>Medication Error Summary Report (${start_date}${end_date})</h2>
                    </div>
    
                    <div class="generated-date">
                        Generated on: ${moment().format("MMM. DD, YYYY")}
                    </div>
    
                    <table border="1" cellpadding="5" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Report Date</th>
                                <th>Medication Error Date</th>
                                <th>Error Type</th>
                                <th>Patient Sex</th>
                                <th>Patient Weight</th>
                                <th>Patient Height</th>
                                <th>Exact Prescription</th>
                                <th>Incident Description</th>
                                <th>Workplace Environment</th>
                                <th>Immediate Actions</th>
                                <th>Corrective Actions</th>
                                <th>Preventive Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reports
                                .map(
                                    (row) => `
                                    <tr>
                                        <td>${moment(row.report_date).format(
                                            "MMM. DD, YYYY"
                                        )}</td>
                                        <td>${moment(row.error_date).format(
                                            "MMM. DD, YYYY"
                                        )}</td>
                                        <td>${row.error_type_name || ""}</td>
                                        <td>${row.patient_sex || ""}</td>
                                        <td>${row.patient_weight || ""}</td>
                                        <td>${row.patient_height || ""}</td>
                                        <td>${row.exact_prescription || ""}</td>
                                        <td>${
                                            row.incident_description || ""
                                        }</td>
                                        <td>${
                                            row.workplace_environment || ""
                                        }</td>
                                        <td>${row.immediate_actions || ""}</td>
                                        <td>${row.corrective_actions || ""}</td>
                                        <td>${row.preventive_actions || ""}</td>
                                    </tr>
                                `
                                )
                                .join("")}
                        </tbody>
                    </table>
                </body>
            </html>
            `;

    return htmls;
};
