import { Op } from "sequelize";
import { sequelize } from "./models/index.js";
import { formatSeqObj } from "./utils/object.utils.js";

const runQuery = async () => {
    const { Agency } = sequelize.models;
    const agencies = await Agency.findOne({
        where: {
            head_id: "207ac622-41c8-4f4d-948d-419bd6c0a795",
            status: "activated",
        },
        include: [
            {
                model: sequelize.models.user,
                as: "coordinators",
                through: {
                    as: "coordinator",
                    where: {
                        status: {
                            [Op.not]: "for approval",
                        },
                    },
                },
            },
        ],
    });

    console.log("Coordinators>>", formatSeqObj(agencies.coordinators));
};

runQuery();
