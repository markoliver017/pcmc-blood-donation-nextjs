const PhysicalExaminationModel = (sequelize, DataTypes) => {
    const PhysicalExamination = sequelize.define(
        "PhysicalExamination",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            appointment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                async isValidAppointment(value) {
                    const Appointment = sequelize.models.DonorAppointmentInfo;
                    if (!Appointment) {
                        throw new Error("Appointment model is not available.");
                    }
                    if (value) {
                        const appointment = await Appointment.findByPk(value);
                        if (!appointment) {
                            throw new Error("Invalid Appointment ID.");
                        }
                    }
                },
            },
            donor_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
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
            event_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                async isValidEvent(value) {
                    const BloodDonationEvent =
                        sequelize.models.BloodDonationEvent;
                    if (!BloodDonationEvent) {
                        throw new Error(
                            "Blood Donation Event model is not available."
                        );
                    }
                    if (value) {
                        const event = await BloodDonationEvent.findByPk(value);
                        if (!event) {
                            throw new Error("Invalid Blood Donation Event ID.");
                        }
                    }
                },
            },
            examiner_id: {
                type: DataTypes.UUID,
                allowNull: false,
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
            blood_pressure: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            pulse_rate: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            hemoglobin_level: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            weight: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: true,
            },
            temperature: {
                type: DataTypes.DECIMAL(4, 1),
                allowNull: true,
            },
            eligibility_status: {
                type: DataTypes.ENUM(
                    "ACCEPTED",
                    "TEMPORARILY-DEFERRED",
                    "PERMANENTLY-DEFERRED"
                ),
                allowNull: false,
                defaultValue: "ACCEPTED",
            },
            deferral_reason: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            updated_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },
        },
        {
            timestamps: true,
            tableName: "physical_examinations",
        }
    );

    PhysicalExamination.associate = (models) => {
        PhysicalExamination.belongsTo(models.Donor, {
            foreignKey: "donor_id",
        });

        PhysicalExamination.belongsTo(models.DonorAppointmentInfo, {
            foreignKey: "appointment_id",
        });

        PhysicalExamination.belongsTo(models.BloodDonationEvent, {
            foreignKey: "event_id",
        });

        PhysicalExamination.belongsTo(models.User, {
            foreignKey: "examiner_id",
        });
    };

    return PhysicalExamination;
};

export default PhysicalExaminationModel;
