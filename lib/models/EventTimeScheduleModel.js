const EventTimeScheduleModel = (sequelize, DataTypes) => {
    const EventTimeSchedule = sequelize.define(
        "EventTimeSchedule",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            blood_donation_event_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Blood donation event is required.",
                    },
                    async isValidEvent(value) {
                        const BloodDonationEvent =
                            sequelize.models.BloodDonationEvent;
                        if (!BloodDonationEvent) {
                            throw new Error(
                                "Blood Donation Event model is not available."
                            );
                        }
                        if (value) {
                            const event = await BloodDonationEvent.findByPk(
                                value
                            );
                            if (!event) {
                                throw new Error(
                                    "Invalid Blood Donation Event ID."
                                );
                            }
                        }
                    },
                },
            },

            time_start: {
                type: DataTypes.TIME,
                allowNull: false,
                validate: {
                    isTime: {
                        args: true,
                        msg: "Invalid start time.",
                    },
                },
            },
            time_end: {
                type: DataTypes.TIME,
                allowNull: false,
                validate: {
                    isTime: {
                        args: true,
                        msg: "Invalid end time.",
                    },
                    isAfter: {
                        args: sequelize.col("time_start"), // Ensure time_end is after time_start
                        msg: "End time must be after start time.",
                    },
                },
            },
            status: {
                type: DataTypes.ENUM("open", "closed"),
                allowNull: false,
                defaultValue: "open",
                validate: {
                    isIn: {
                        args: [["open", "closed"]],
                        msg: "Invalid status type.",
                    },
                },
            },
            has_limit: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            max_limit: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    isInt: true,
                    min: 1,
                },
            },
        },
        { timestamps: true, tableName: "event_time_schedules" }
    );

    EventTimeSchedule.associate = (models) => {
        EventTimeSchedule.belongsTo(models.BloodDonationEvent, {
            foreignKey: "blood_donation_event_id",
            as: "time_schedules",
            onDelete: "CASCADE",
        });
        EventTimeSchedule.hasMany(models.DonorAppointmentInfo, {
            foreignKey: "time_schedule_id",
            as: "donors",
            onDelete: "CASCADE",
        });
    };

    return EventTimeSchedule;
};

export default EventTimeScheduleModel;
