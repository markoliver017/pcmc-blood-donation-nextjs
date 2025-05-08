"use server";

export const fetchErrorTypes = async () => {
    const url = new URL(`/api/error_types`, process.env.NEXT_PUBLIC_DOMAIN);
    const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });
    return await response.json();
};
