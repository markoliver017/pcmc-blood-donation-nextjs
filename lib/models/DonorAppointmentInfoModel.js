const DonorAppointmentInfoModel = (sequelize, DataTypes) => {
    const DonorAppointmentInfo = sequelize.define(
        "DonorAppointmentInfo",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            donor_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Donor ID is required.",
                    },
                    async isValidDonor(value) {
                        const Donor = sequelize.models.Donor;
                        if (!Donor) {
                            throw new Error("Donor model is not available.");
                        }
                        if (value) {
                            const donor = await Donor.findByPk(value);
                            if (!donor) {
                                throw new Error("Invalid Donor ID.");
                            }
                        }
                    },
                },
            },
            booking_schedule_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Booking Schedule is required.",
                    },
                    async isValidBooking(value) {
                        const BookingSchedule =
                            sequelize.models.BookingSchedule;
                        if (!BookingSchedule) {
                            throw new Error(
                                "Booking Schedule model is not available."
                            );
                        }
                        if (value) {
                            const booking = await BookingSchedule.findByPk(
                                value
                            );
                            if (!booking) {
                                throw new Error("Invalid Booking Schedule ID.");
                            }
                        }
                    },
                },
            },
            donor_type: {
                type: DataTypes.ENUM("replacement", "volunteer"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["replacement", "volunteer"]],
                        msg: "Donor type must be either 'replacement' or 'volunteer'.",
                    },
                },
            },
            patient_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            relation: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            collection_method: {
                type: DataTypes.ENUM("whole blood", "apheresis"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["whole blood", "apheresis"]],
                        msg: "Collection method must be either 'whole blood' or 'apheresis'.",
                    },
                },
            },
            status: {
                type: DataTypes.ENUM(
                    "pending",
                    "confirmed",
                    "cancelled",
                    "completed",
                    "rejected"
                ),
                allowNull: false,
                defaultValue: "pending",
                validate: {
                    isIn: {
                        args: [
                            [
                                "pending",
                                "confirmed",
                                "cancelled",
                                "completed",
                                "rejected",
                            ],
                        ],
                        msg: "Status must be a valid value.",
                    },
                },
            },
            comments: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        { timestamps: true, tableName: "donor_appointment_infos" }
    );

    DonorAppointmentInfo.associate = (models) => {
        DonorAppointmentInfo.belongsTo(models.Donor, {
            foreignKey: "donor_id",
        });
        DonorAppointmentInfo.belongsTo(models.BookingSchedule, {
            foreignKey: "booking_schedule_id",
        });
    };

    return DonorAppointmentInfo;
};

export default DonorAppointmentInfoModel;
