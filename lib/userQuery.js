import { sequelize } from "./models/index.js";
import { formatSeqObj } from "./utils/object.utils.js";

const runQuery = async () => {
    const { user: User } = sequelize.models;
    let user = await User.findOne({
        where: { email: "mark@email.com" },
        // include: [
        //     {
        //         where: { role_name: "Agency Administrator" },
        //         model: sequelize.models.Role,
        //         attributes: ["id", "role_name", "icon", "url"],
        //         as: "roles",
        //         required: true,
        //         through: {
        //             attributes: ["id", "is_active"],
        //             as: "role",
        //         },
        //     },
        // ],
    });

    // const UserRole = user?.roles[0].role;
    // console.log("user?.roles[0].role", user?.roles[0].role);
    // UserRole.update({ is_active: 1 });
    // single
    // if (user) {
    //     const addedRoles = await user.addRoles([2, 3, 4, 5]);
    // }

    //multiple
    // const addedRoles = await user.setRoles([1]);
    // if (addedRoles) {
    //     console.log("addedRoles>>", formatSeqObj(addedRoles));
    // }
    // await user.reload({
    //     include: [
    //         {
    //             where: { role_name: "Agency Administrator" },
    //             model: sequelize.models.Role,
    //             attributes: ["id", "role_name", "icon", "url"],
    //             as: "roles",
    //             through: {
    //                 attributes: ["is_active"],
    //                 as: "role",
    //             },
    //         },
    //     ],
    // });

    console.log("User>>", formatSeqObj(user));
};

runQuery();
