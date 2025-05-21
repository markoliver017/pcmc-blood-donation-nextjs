import { Role } from "@lib/models";

export async function getOrganizerRole() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
        const role = await Role.findOne({
            where: { role_name: "Agency Administrator" },
            attributes: { exclude: ["createdAt", "updatedAt", "icon"] },
        });

        if (!role)
            throw "Database Error: Please contact your administrator. No Agency Administrator role found!";

        return role.get({ plain: true });
    } catch (error) {
        console.error(error);
        throw error;
    }
}
