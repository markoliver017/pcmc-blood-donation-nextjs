"use server";

import { createReportsSchema } from "@lib/zod/reportSchema";

export async function submitForm(data) {
    const result = createReportsSchema.safeParse(data);

    console.log("Form data:>>>>>>>>", data);
    console.log("Validation result:>>>>>>>>>>>>>", result);

    if (!result.success) {
        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
        };
    }

    return { success: true };
}

export const fetchErrorTypes = async () => {

    const url = new URL(`/api/error_types`, process.env.NEXT_PUBLIC_DOMAIN);
    const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });

    return res.json();
};

export const fetchGenericMedicines = async () => {
    const url = new URL(
        `/api/generic_medicines`,
        process.env.NEXT_PUBLIC_DOMAIN
    );
    const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });

    return res.json();
};

export const fetchMedicineRoutes = async () => {
    const url = new URL(`/api/route_medicines`, process.env.NEXT_PUBLIC_DOMAIN);
    const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });

    return res.json();
};
