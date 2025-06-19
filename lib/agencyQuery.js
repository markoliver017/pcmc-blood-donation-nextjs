import { Agency, AgencyCoordinator, User } from "./models/index.js";
import { formatSeqObj } from "./utils/object.utils.js";

const runQuery = async () => {
    // const { Agency } = sequelize.models;
    // const agencies = await Agency.findOne({
    //     where: {
    //         head_id: "207ac622-41c8-4f4d-948d-419bd6c0a795",
    //         status: "activated",
    //     },
    //     include: [
    //         {
    //             model: sequelize.models.user,
    //             as: "coordinators",
    //             through: {
    //                 as: "coordinator",
    //                 where: {
    //                     status: {
    //                         [Op.not]: "for approval",
    //                     },
    //                 },
    //             },
    //         },
    //     ],
    // });

    let profile = await User.findByPk("207ac622-41c8-4f4d-948d-419bd6c0a795", {
        include: [
            {
                model: Agency,
                as: "headedAgency",
                required: false,
            },
            {
                model: AgencyCoordinator,
                as: "coordinator",
                attributes: [
                    "id",
                    "status",
                    "contact_number",
                    "comments",
                    "remarks",
                ],
                where: { status: "activated" },
                required: false,
                include: {
                    model: Agency,
                    as: "agency",
                    include: {
                        model: User,
                        as: "head",
                        attributes: ["id", "name", "email"],
                    },
                },
            },
        ],
    });

    console.log(
        "User Profile>>",
        formatSeqObj(profile.coordinator.agency.head)
    );
};

runQuery();
