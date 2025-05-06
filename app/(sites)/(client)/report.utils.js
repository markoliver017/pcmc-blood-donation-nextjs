import moment from "moment";

export const downloadReport = async (
    data,
    genericMedicineOptions,
    medicineRouteOptions
) => {
    const error_type =
        data.selected_error_type?.value == "Others"
            ? `${data.selected_error_type?.label} <i>(${watch(
                  "other_error_type"
              )})</i>`
            : data.selected_error_type?.label;

    const html = `
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
                        <h2>Medication Error Report</h2>
                    </div>
    
                    <div class="generated-date">
                        Reported on: ${moment().format("MMM. DD, YYYY")}
                    </div>
                    <table border="1" cellpadding="5" cellspacing="0">
                        <tbody>
                            <tr >
                                <th
                                    colspan="2"
                                    class="text-center"
                                >
                                    Patient
                                    Details
                                </th>
                            </tr>

                            <tr>
                                <th>
                                    Patient
                                    Sex
                                </th>
                                <td>
                                    ${data.patient_sex}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Patient
                                    Age
                                </th>
                                <td>
                                ${data.patient_age} ${data.age_unit}(s) old
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Patient
                                    Weight
                                </th>
                                <td>
                                ${data.patient_weight} (${data.weight_unit})
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Patient
                                    Height
                                </th>
                                <td>
                                    ${data.patient_height}
                                    ${
                                        !isNaN(data.patient_height)
                                            ? `(${data.height_unit})`
                                            : ""
                                    }
                                </td>
                            </tr>
                            <tr>
                                <th
                                    colspan="2"
                                    class="text-center"
                                >
                                    Medication
                                    Error
                                    Details
                                </th>
                            </tr>
                            <tr>
                                <th>
                                    Medication
                                    Report
                                    Date
                                </th>
                                <td>
                                ${data.error_date}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Medication
                                    error
                                    Type
                                </th>
                                <td>
                                    ${error_type}
                                </td>
                            </tr>
                            ${
                                data.selected_error_type?.is_medicine_needed &&
                                data.medicines.length
                                    ? `
                                    <tr>
                                        <th>Medicine Details</th>
                                        <td>
                                            <table class="table ml-5" style="margin-left: 1rem;">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Generic Medicine</th>
                                                        <th>Route</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${data.medicines
                                                        .map((med, index) => {
                                                            const genericLabel =
                                                                genericMedicineOptions.find(
                                                                    (gen) =>
                                                                        gen.id ==
                                                                        med.medicine_generic_id
                                                                )?.label ||
                                                                "N/A";

                                                            const routeLabel =
                                                                medicineRouteOptions.find(
                                                                    (route) =>
                                                                        route.id ==
                                                                        med.medicine_route_id
                                                                )?.label ||
                                                                "N/A";

                                                            return `
                                                            <tr>
                                                                <td>${
                                                                    index + 1
                                                                }</td>
                                                                <td>${genericLabel}</td>
                                                                <td>${routeLabel}</td>
                                                            </tr>
                                                        `;
                                                        })
                                                        .join("")}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                `
                                    : ""
                            }
                            <tr>
                                <th>
                                    Exact
                                    Prescription
                                </th>
                                <td>
                                    ${data.exact_prescription}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Incident
                                    Description
                                </th>
                                <td>
                                    ${data.incident_description}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Workplace
                                    Environment
                                </th>
                                <td>
                                    ${data.incident_description}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Patient
                                    Condition
                                </th>
                                <td>
                                    ${data.patient_condition}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Immediate
                                    Actions
                                </th>
                                <td>
                                    ${data.immediate_actions}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Corrective
                                    Actions
                                </th>
                                <td>
                                    ${data.corrective_actions}
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    Preventive
                                    Actions
                                </th>
                                <td>
                                    ${data.preventive_actions}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </body>
            </html>
        `;

    const apiUrl = new URL(`/api/generate-pdf`, process.env.NEXT_PUBLIC_DOMAIN);
    const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ html }),
    });

    if (!res.ok) {
        console.error(`Failed to generate PDF: ${res.statusText}`);
        return false;
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
    return true;
};
