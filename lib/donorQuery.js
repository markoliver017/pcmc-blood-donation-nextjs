import { Agency, BloodType, Donor, sequelize } from "./models/index.js";
import { formatSeqObj } from "./utils/object.utils.js";

const runQuery = async () => {
    const donors = await Donor.findAll({
        // where: {
        //     status: {
        //         [Op.not]: "for approval",
        //     },
        // },
        include: [
            {
                model: sequelize.models.user,
                as: "user",
            },
            {
                model: Agency,
                as: "agency",
            },
            {
                model: BloodType,
                as: "blood_type",
            },
        ],
    });

    console.log("Donors>>", formatSeqObj(donors));
};

runQuery();
