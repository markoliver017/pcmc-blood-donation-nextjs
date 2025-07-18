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
            time_schedule_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Booking Schedule is required.",
                    },
                    async isValidBooking(value) {
                        const EventTimeSchedule =
                            sequelize.models.EventTimeSchedule;
                        if (!EventTimeSchedule) {
                            throw new Error(
                                "Booking Schedule model is not available."
                            );
                        }
                        if (value) {
                            const booking = await EventTimeSchedule.findByPk(
                                value
                            );
                            if (!booking) {
                                throw new Error("Invalid Booking Schedule ID.");
                            }
                        }
                    },
                },
            },
            event_id: {
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
            donor_type: {
                type: DataTypes.ENUM("replacement", "volunteer"),
                allowNull: false,
                defaultValue: "volunteer",
                validate: {
                    isIn: {
                        args: [["replacement", "volunteer"]],
                        msg: "Donor type must be either 'replacement' or 'volunteer'.",
                    },
                },
            },
            collection_method: {
                type: DataTypes.ENUM("whole blood", "apheresis"),
                allowNull: false,
                defaultValue: "whole blood",
                validate: {
                    isIn: {
                        args: [["whole blood", "apheresis"]],
                        msg: "Collection method must be either 'whole blood' or 'apheresis'.",
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
            status: {
                type: DataTypes.ENUM(
                    "registered",
                    "cancelled",
                    "deferred",
                    "no show",
                    "examined",
                    "collected"
                ),
                allowNull: false,
                defaultValue: "registered",
                validate: {
                    isIn: {
                        args: [
                            [
                                "registered",
                                "cancelled",
                                "no show",
                                "deferred",
                                "examined",
                                "collected",
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
            updated_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },
        },
        { timestamps: true, tableName: "donor_appointment_infos" }
    );

    DonorAppointmentInfo.associate = (models) => {
        DonorAppointmentInfo.belongsTo(models.Donor, {
            foreignKey: "donor_id",
            as: "donor",
        });
        DonorAppointmentInfo.belongsTo(models.EventTimeSchedule, {
            foreignKey: "time_schedule_id",
            as: "time_schedule",
            onDelete: "RESTRICT",
        });
        DonorAppointmentInfo.belongsTo(models.BloodDonationEvent, {
            foreignKey: "event_id",
            as: "event",
            onDelete: "RESTRICT",
        });
        DonorAppointmentInfo.hasOne(models.PhysicalExamination, {
            foreignKey: "appointment_id",
            as: "physical_exam",
            onDelete: "CASCADE",
        });

        DonorAppointmentInfo.hasOne(models.BloodDonationCollection, {
            foreignKey: "appointment_id",
            as: "blood_collection",
            onDelete: "CASCADE",
        });
    };

    return DonorAppointmentInfo;
};

export default DonorAppointmentInfoModel;
