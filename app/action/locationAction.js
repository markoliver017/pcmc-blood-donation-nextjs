// https://psgc.gitlab.io/api/regions/130000000 NCR
// https://psgc.gitlab.io/api/island-groups/luzon/provinces Luzon
"use server";

export async function fetchluzonDemographics() {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const ncrUrl = new URL(
        `https://psgc.gitlab.io/api/regions/130000000`,
        process.env.NEXT_PUBLIC_DOMAIN
    );
    const luzonProvinceUrl = new URL(
        `https://psgc.gitlab.io/api/island-groups/luzon/provinces`,
        process.env.NEXT_PUBLIC_DOMAIN
    );
    const ncrRes = await fetch(ncrUrl, {
        method: "GET",
        cache: "force-cache",
    });
    const luzonRes = await fetch(luzonProvinceUrl, {
        method: "GET",
        cache: "force-cache",
    });

    const luzonProvinces = await luzonRes.json();
    const ncrRegion = await ncrRes.json();

    const combined = [
        {
            code: ncrRegion.code,
            name: "Metro Manila",
            is_ncr: true,
        },
        ...luzonProvinces,
    ];

    return combined;
}

// https://psgc.gitlab.io/api/regions/${code}/cities-municipalities/ =NCR
// https://psgc.gitlab.io/api/provinces/${code}/cities-municipalities/ =LUZON PROVINCES
export async function fetchCitiesMunicipalities(province) {
    const { code } = province;
    let url = `https://psgc.gitlab.io/api/provinces/${code}/cities-municipalities/`;
    if (province?.is_ncr) {
        url = `https://psgc.gitlab.io/api/regions/${code}/cities-municipalities/`;
    }

    const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });

    return await res.json();
}

export async function fetchBarangays(city) {
    const { code } = city;
    let url = `https://psgc.gitlab.io/api/cities-municipalities/${code}/barangays/`;

    const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });

    return await res.json();
}
