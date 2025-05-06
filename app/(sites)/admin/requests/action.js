"use server";

export async function fetchRequest(start, end) {
    let url = new URL(`/api/requests`, process.env.NEXT_PUBLIC_DOMAIN);
    if (start && end) {
        url = new URL(
            `/api/requests?start_date=${start}&end_date=${end}`,
            process.env.NEXT_PUBLIC_DOMAIN
        );
    }
    const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });

    return response.json();
}

