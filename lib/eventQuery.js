import { Op } from "sequelize";
import {
    DonorAppointmentInfo,
    EventTimeSchedule,
    sequelize,
} from "./models/index.js";
import { formatSeqObj } from "./utils/object.utils.js";

const runQuery = async () => {
    const sched = await EventTimeSchedule.findByPk(15, {
        attributes: {
            include: [
                [
                    sequelize.fn("COUNT", sequelize.col("donors.id")),
                    "donorCount",
                ],
            ],
        },
        include: [
            {
                model: DonorAppointmentInfo,
                as: "donors",
                attributes: [], // Don't fetch full donor records
                required: false,
                where: {
                    status: {
                        [Op.not]: "cancelled",
                    },
                },
            },
        ],
        group: ["EventTimeSchedule.id"],
    });

    console.log("time schedule>>", formatSeqObj(sched));
};

runQuery();
