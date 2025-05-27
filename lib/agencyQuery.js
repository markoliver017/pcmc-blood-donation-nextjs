import { sequelize } from "./models/index.js";
import { formatSeqObj } from "./utils/object.utils.js";

const runQuery = async () => {
    const { Agency } = sequelize.models;
    const agencies = await Agency.findAll({
        where: { status: "activated" },
        attributes: {
            exclude: [
                "remarks",
                "verified_by",
                "updated_by",
                "createdAt",
                "updatedAt",
                "status",
                "comments",
                "head_id",
            ],
        },
        include: [
            {
                model: sequelize.models.user,
                as: "head",
                attributes: {
                    exclude: [
                        "password",
                        "email_verified",
                        "prefix",
                        "suffix",
                        "createdAt",
                        "updatedAt",
                        "updated_by",
                    ],
                },
            },
        ],
    });

    console.log("User>>", formatSeqObj(agencies));
};

runQuery();
