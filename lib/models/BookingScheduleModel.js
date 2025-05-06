const BookingScheduleModel = (sequelize, DataTypes) => {
    const BookingSchedule = sequelize.define(
        "BookingSchedule",
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
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    isDate: {
                        msg: "Invalid date.",
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
            max_limit: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: true,
                    min: 1,
                },
            },
        },
        { timestamps: true, tableName: "booking_schedules" }
    );

    BookingSchedule.associate = (models) => {
        BookingSchedule.belongsTo(models.BloodDonationEvent, {
            foreignKey: "blood_donation_event_id",
            onDelete: "CASCADE",
        });
    };

    return BookingSchedule;
};

export default BookingScheduleModel;
