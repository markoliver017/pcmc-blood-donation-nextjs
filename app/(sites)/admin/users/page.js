import { Suspense } from "react";
import Skeleton from "@components/ui/skeleton";
import { fetchAdmins } from "./action";
import { DataTable } from "./DataTable";

export const metadata = {
    title: "Inmerse Portal - Users Management",
    description:
        "Integrated National Medication Error Reporting System - Users Management",
};

export default async function Page() {
    const admins = fetchAdmins();

    return (
        <Suspense fallback={<Skeleton />}>
            <div className="w-full min-h-[600px] overflow-x-auto">
                <DataTable admins={admins} />
            </div>
        </Suspense>
    );
}
