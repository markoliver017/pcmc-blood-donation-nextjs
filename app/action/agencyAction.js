// https://psgc.gitlab.io/api/regions/130000000 NCR
// https://psgc.gitlab.io/api/island-groups/luzon/provinces Luzon
"use server";

import { userSchema } from "@lib/zod/userSchema";

export async function fetchluzonDemographics() {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const ncrUrl = new URL(`https://psgc.gitlab.io/api/regions/130000000`, process.env.NEXT_PUBLIC_DOMAIN);
    const luzonProvinceUrl = new URL(`https://psgc.gitlab.io/api/island-groups/luzon/provinces`, process.env.NEXT_PUBLIC_DOMAIN);
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

    const combined = [...luzonProvinces, {
        code: ncrRegion.code,
        name: "Metro Manila",
        is_ncr: true
    }];

    return combined;


}

// https://psgc.gitlab.io/api/regions/${code}/cities-municipalities/ =NCR
// https://psgc.gitlab.io/api/provinces/${code}/cities-municipalities/ =LUZON PROVINCES
export async function fetchCitiesMunicipalities(location) {
    const { code } = location;
    let url = `https://psgc.gitlab.io/api/provinces/${code}/cities-municipalities/`;
    if (location?.is_ncr) {
        url = `https://psgc.gitlab.io/api/regions/${code}/cities-municipalities/`;
    }

    const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });


    return await res.json();

}

export async function createAgency(formData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("formData received on server", formData);
    const parsed = userSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message: "Validation Error",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    const transaction = await sequelize.transaction();

    try {
        const existing = await User.findOne({
            where: { email: data.email },
            transaction,
        });

        if (existing) {
            throw new Error("Email already exists");
        }

        const newUser = await User.create(data, { transaction });

        await transaction.commit();

        return { success: true, data: newUser.get({ plain: true }) };
    } catch (err) {
        console.error("error?????", err);
        await transaction.rollback();

        throw err.message || "Unknown error";
    }
}