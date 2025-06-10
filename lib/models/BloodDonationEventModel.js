const BloodDonationEventModel = (sequelize, DataTypes) => {
    const BloodDonationEvent = sequelize.define(
        "BloodDonationEvent",
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
            requester_id: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "User ID is required.",
                    },
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
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Title cannot be empty.",
                    },
                    len: {
                        args: [5, 255],
                        msg: "Title must be between 5 and 255 characters.",
                    },
                },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            from_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    isDate: true,
                    notEmpty: {
                        msg: "Date is required.",
                    },
                },
            },
            to_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    isDate: true,
                    notEmpty: {
                        msg: "Date is required.",
                    },
                },
            },
            file_url: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM(
                    "approved",
                    "for approval",
                    "cancelled",
                    "rejected"
                ),
                allowNull: false,
                defaultValue: "for approval",
                validate: {
                    isIn: {
                        args: [
                            [
                                "approved",
                                "for approval",
                                "cancelled",
                                "rejected",
                            ],
                        ],
                        msg: "Invalid status type.",
                    },
                },
            },
            remarks: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        { timestamps: true, tableName: "blood_donation_events" }
    );

    BloodDonationEvent.associate = (models) => {
        BloodDonationEvent.belongsTo(models.Agency, {
            foreignKey: "agency_id",
            as: "agency",
            onDelete: "RESTRICT",
        });
        BloodDonationEvent.belongsTo(models.User, {
            foreignKey: "requester_id",
            as: "requester",
        });

        BloodDonationEvent.hasMany(models.EventTimeSchedule, {
            foreignKey: "blood_donation_event_id",
            as: "time_schedules",
        });
    };

    return BloodDonationEvent;
};

export default BloodDonationEventModel;
