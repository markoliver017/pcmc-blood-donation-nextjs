import { redirect } from "next/navigation";
import parse from "html-react-parser";
import Link from "next/link";

export default async function Page({ params }) {
    const { id } = await params;
    const url = new URL(`/api/reports/${id}`, "http://localhost:3000");
    const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });
    const { report } = await response.json();
    if (!report) redirect("/admin/reports");

    console.log("report", report);
    const formatAge = (age) => (age % 1 === 0 ? `${age | 0}` : `${age}`);

    const error_type =
        report.error_type.name == "Others"
            ? `${report.error_type.name} <i>(${report.other_error_type})</i>`
            : report.error_type.name;

    return (
        <div className="overflow-x-auto">
            <Link className="btn btn-neutral" href="/admin/reports">
                Back
            </Link>
            <div className="card shadow-md mt-2">
                <div className="card-body overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table table-zebra">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>Fields</th>
                                <th>Inputs</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-gray-200 border-b border-gray-300">
                                <th colSpan={2}>Patient Details</th>
                            </tr>
                            <tr className="hover:bg-base-300">
                                <th>ID</th>
                                <td>{report.id}</td>
                            </tr>
                            <tr className="hover:bg-base-300">
                                <th>Patient Sex</th>
                                <td>{report.patient_sex.toUpperCase()}</td>
                            </tr>
                            <tr className="hover:bg-base-300">
                                <th>Patient Age</th>
                                <td>
                                    {formatAge(report.patient_age)}{" "}
                                    {report.age_unit}(s) old
                                </td>
                            </tr>
                            <tr className="hover:bg-base-300">
                                <th>Patient Height</th>
                                <td>
                                    {report.patient_height}
                                    {!isNaN(report.patient_height)
                                        ? `(${report.height_unit})`
                                        : ""}
                                </td>
                            </tr>
                            <tr className="hover:bg-base-300">
                                <th>Patient Weight</th>
                                <td>
                                    {report.patient_weight}({report.weight_unit}
                                    )
                                </td>
                            </tr>
                            <tr className="bg-gray-200 border-b border-gray-300">
                                <th colSpan={2}>Medication Error Details</th>
                            </tr>
                            <tr className="hover:bg-base-300">
                                <th>Reported Date</th>
                                <td>{report.report_date}</td>
                            </tr>
                            <tr className="hover:bg-base-300">
                                <th>Medication Error Date</th>
                                <td>{report.error_date}</td>
                            </tr>
                            <tr className="hover:bg-base-300">
                                <th>Error Type</th>
                                <td>{parse(error_type)}</td>
                            </tr>
                            {report.error_type.is_medicine_needed &&
                                report.ReportMedicineRoutes.length && (
                                    <tr>
                                        <th>Medicine Details</th>
                                        <td>
                                            <table className="table table-zebra">
                                                <thead className="bg-gray-200">
                                                    <tr>
                                                        <th>
                                                            Generic Medicine
                                                        </th>
                                                        <th>Route</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {report.ReportMedicineRoutes.map(
                                                        (med, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    {
                                                                        med
                                                                            .GenericMedicine
                                                                            .name
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        med
                                                                            .RouteMedicine
                                                                            .name
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                            <tr className="hover:bg-base-300">
                                <th>Exact Prescription</th>
                                <td>{report.exact_prescription}</td>
                            </tr>
                            <tr className="hover:bg-base-300">
                                <th>Incident Description</th>
                                <td>{report.incident_description}</td>
                            </tr>
                            <tr className="hover:bg-base-300">
                                <th>Workplace Environment</th>
                                <td>{report.workplace_environment}</td>
                            </tr>
                            <tr className="hover:bg-base-300">
                                <th>Patient Condition</th>
                                <td>{report.patient_condition}</td>
                            </tr>

                            <tr className="hover:bg-base-300">
                                <th>Immediate Actions</th>
                                <td>{report.immediate_actions}</td>
                            </tr>
                            <tr className="hover:bg-base-300">
                                <th>Corrective Actions</th>
                                <td>{report.corrective_actions}</td>
                            </tr>
                            <tr className="hover:bg-base-300">
                                <th>Preventive Actions</th>
                                <td>{report.preventive_actions}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
