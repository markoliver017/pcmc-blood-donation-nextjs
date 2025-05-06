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
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "User ID is required.",
                    },
                    async isValidUser(value) {
                        const User = sequelize.models.User;
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
            contact_number: {
                type: DataTypes.STRING(15),
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Contact number is required.",
                    },
                    is: {
                        args: /^\(?(\+63|\(0[0-9]\)|0[0-9])\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{3,5})$/,
                        msg: "Contact number must be a valid telephone or mobile number.",
                    },
                    len: {
                        args: [10, 18],
                        msg: "Contact number must be between 10 and 18 digits.",
                    },
                },
            },
            status: {
                type: DataTypes.ENUM("for approval", "active", "deactivated"),
                defaultValue: "for approval",
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Status is required.",
                    },
                    isIn: {
                        args: [["for approval", "active", "deactivated"]],
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
        });
        AgencyCoordinator.belongsTo(models.User, {
            foreignKey: "user_id",
        });
    };

    return AgencyCoordinator;
};

export default AgencyCoordinatorModel;
