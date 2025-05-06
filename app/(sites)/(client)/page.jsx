import { Suspense } from "react";
import {
    fetchErrorTypes,
    fetchGenericMedicines,
    fetchMedicineRoutes,
} from "./action";
import Skeleton from "@components/ui/skeleton";
import Terms from "./Terms";
// import { useSession } from "next-auth/react";

export const metadata = {
    title: "Inmerse Portal - Dashboard",
    description:
        "Integrated National Medication Error Reporting System - Dashboard",
};

export default function Page() {
    const fetch_error_types = fetchErrorTypes();
    const fetch_generic_medicines = fetchGenericMedicines();
    const fetch_medicine_routes = fetchMedicineRoutes();
    // const { data: session, status } = useSession();
    // if (status === "loading") return <p>Loading...</p>;
    // if (!session) return <p>You are not signed in.</p>;

    return (
        <Suspense fallback={<Skeleton />}>
            <Terms
                fetch_error_types={fetch_error_types}
                fetch_generic_medicines={fetch_generic_medicines}
                fetch_medicine_routes={fetch_medicine_routes}
            />
        </Suspense>
    );
}
