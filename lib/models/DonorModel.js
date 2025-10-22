const DonorModel = (sequelize, DataTypes) => {
    const Donor = sequelize.define(
        "Donor",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            donor_reference_id: {
                type: DataTypes.STRING,
            },
            agency_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    async isValidAgency(value) {
                        if (value !== null && value !== undefined) {
                            const Agency = sequelize.models.Agency;
                            if (!Agency) {
                                throw new Error(
                                    "Agency model is not available."
                                );
                            }
                            if (value) {
                                const agency = await Agency.findByPk(value);
                                if (!agency) {
                                    throw new Error("Invalid Agency ID.");
                                }
                            }
                        }
                    },
                },
            },
            donor_type: {
                type: DataTypes.ENUM("agency", "walk-in"),
                allowNull: false,
                defaultValue: "walk-in",
                validate: {
                    isIn: {
                        args: [["agency", "walk-in"]],
                        msg: "Invalid donor type.",
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
                    // async isValidUser(value) {
                    //     const User = sequelize.models.user;
                    //     if (!User) {
                    //         throw new Error("User model is not available.");
                    //     }
                    //     if (value) {
                    //         const user = await User.findByPk(value);
                    //         if (!user) {
                    //             throw new Error("Invalid User ID.");
                    //         }
                    //     }
                    // },
                },
            },
            blood_type_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    async isValidBloodType(value) {
                        if (!value) return;
                        const BloodType = sequelize.models.BloodType;
                        if (!BloodType) {
                            throw new Error(
                                "Blood Type model is not available."
                            );
                        }
                        if (value) {
                            const bloodType = await BloodType.findByPk(value);
                            if (!bloodType) {
                                throw new Error("Invalid Blood type ID.");
                            }
                        }
                    },
                },
            },
            date_of_birth: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    isDate: true,
                    notEmpty: {
                        msg: "Birthdate is required.",
                    },
                },
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Address is required.",
                    },
                },
            },
            barangay: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Barangay is required.",
                    },
                },
            },
            city_municipality: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "City is required.",
                    },
                },
            },
            province: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Metro Manila",
                validate: {
                    notEmpty: {
                        msg: "Province is required.",
                    },
                },
            },
            region: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "luzon",
                validate: {
                    notEmpty: {
                        msg: "Region is required.",
                    },
                },
            },
            civil_status: {
                type: DataTypes.ENUM(
                    "single",
                    "married",
                    "divorced",
                    "separated",
                    "widowed"
                ),
                allowNull: false,
                defaultValue: "single",
                validate: {
                    isIn: {
                        args: [
                            [
                                "single",
                                "married",
                                "divorced",
                                "separated",
                                "widowed",
                            ],
                        ],
                        msg: "Invalid Civil status type.",
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
                },
            },
            nationality: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Filipino",
            },
            occupation: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            is_regular_donor: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            blood_service_facility: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            // this is the last donation date of the donor before the system was implemented
            donation_history_donation_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            last_donation_event_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            last_donation_examination_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            last_appointment_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            last_donation_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            id_url: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            comments: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            full_address: {
                type: DataTypes.VIRTUAL,
                get() {
                    return `${this.address}, ${this.barangay}, ${this.city_municipality}, ${this.province}.`;
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
            verified_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            updated_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            is_data_verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            data_verified_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            is_bloodtype_verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            bloodtype_verified_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },
        },
        {
            hooks: {
                afterCreate: (donor, options) => {
                    const donorReferenceId = `DN${donor.id
                        .toString()
                        .padStart(6, "0")}`;
                    return donor.update(
                        {
                            donor_reference_id: donorReferenceId,
                        },
                        { transaction: options?.transaction }
                    );
                },
            },
            timestamps: true,
            tableName: "donors",
        }
    );

    Donor.associate = (models) => {
        Donor.belongsTo(models.Agency, {
            foreignKey: "agency_id",
            as: "agency",
        });
        Donor.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
        });
        Donor.belongsTo(models.BloodType, {
            foreignKey: "blood_type_id",
            as: "blood_type",
        });
        Donor.belongsTo(models.User, {
            foreignKey: "verified_by",
            as: "verified_user",
        });
        Donor.hasMany(models.DonorAppointmentInfo, {
            foreignKey: "donor_id",
            as: "appointments",
        });
        Donor.hasMany(models.BloodDonationCollection, {
            foreignKey: "donor_id",
            as: "blood_collections",
        });
        Donor.hasOne(models.BloodDonationHistory, {
            foreignKey: "donor_id",
            as: "blood_history",
        });

        Donor.belongsTo(models.BloodDonationEvent, {
            foreignKey: "last_donation_event_id",
            as: "last_donation_event",
        });
        Donor.belongsTo(models.PhysicalExamination, {
            foreignKey: "last_donation_examination_id",
            as: "last_donation_examination",
        });
        Donor.belongsTo(models.DonorAppointmentInfo, {
            foreignKey: "last_appointment_id",
            as: "last_appointment",
        });
    };

    return Donor;
};

export default DonorModel;
