const AgencyCoordinatorModel = (sequelize, DataTypes) => {
    const AgencyCoordinator = sequelize.define(
        "AgencyCoordinator",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            agency_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Agency ID is required.",
                    },
                    async isValidAgency(value) {
                        if (!value) return;
                        const Agency = sequelize.models.Agency;
                        if (!Agency) {
                            throw new Error("Agency model is not available.");
                        }
                        if (value) {
                            const agency = await Agency.findByPk(value);
                            if (!agency) {
                                throw new Error("Invalid Agency ID.");
                            }
                        }
                    },
                },
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "User ID is required.",
                    },
                },
            },
            contact_number: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Contact number is required.",
                    },
                },
            },
            comments: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            remarks: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            verified_by: {
                type: DataTypes.UUID,
                allowNull: true,
                validate: {
                    async isValidUser(value) {
                        const User = sequelize.models.user;
                        if (!User) {
                            throw new Error("User model is not available.");
                        }
                        if (value) {
                            const user = await User.findByPk(value);
                            if (!user) {
                                throw new Error("Invalid User ID.");
                            }
                        }
                    },
                },
            },
            status: {
                type: DataTypes.ENUM(
                    "for approval",
                    "activated",
                    "deactivated",
                    "rejected"
                ),
                defaultValue: "for approval",
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Status is required.",
                    },
                    isIn: {
                        args: [
                            [
                                "for approval",
                                "activated",
                                "deactivated",
                                "rejected",
                            ],
                        ],
                        msg: "Invalid status.",
                    },
                },
            },
        },
        { timestamps: true, tableName: "agency_coordinators" }
    );

    AgencyCoordinator.associate = (models) => {
        AgencyCoordinator.belongsTo(models.Agency, {
            foreignKey: "agency_id",
            onDelete: "CASCADE",
            as: "agency",
        });
        AgencyCoordinator.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
            as: "user",
        });
    };

    return AgencyCoordinator;
};

export default AgencyCoordinatorModel;
