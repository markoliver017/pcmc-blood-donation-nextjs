import { sequelize } from "./models/index.js";
import { formatSeqObj } from "./utils/object.utils.js";

const runQuery = async () => {
    const { user: User } = sequelize.models;
    let user = await User.findOne({ where: { email: "admin@email.com" } });

    // single
    // const addedRoles = await user.addRoles(2);

    //multiple
    const addedRoles = await user.setRoles([1]);

    await user.reload({
        include: [
            {
                model: sequelize.models.Role,
                // attributes: ['role_name', 'icon'],
                as: "roles",
                through: { attributes: [] },
            },
        ],
    });

    if (addedRoles) {
        console.log("addedRoles>>", formatSeqObj(addedRoles));
    }
    console.log("User>>", formatSeqObj(user));
};

runQuery();
