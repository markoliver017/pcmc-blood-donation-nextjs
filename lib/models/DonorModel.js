const DonorModel = (sequelize, DataTypes) => {
    const Donor = sequelize.define(
        "Donor",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            agency_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
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
                type: DataTypes.UUID,
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
            blood_type_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    async isValidBloodType(value) {
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
            last_donation_date: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            blood_service_facility: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            donor_file_url: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            is_verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            verified_by: {
                type: DataTypes.UUID,
                allowNull: true,
                validate: {
                    async isValidUser(value) {
                        if (!value) return;
                        const User = sequelize.models.User;
                        if (!User) {
                            throw new Error("User model is not available.");
                        }
                        const user = await User.findByPk(value);
                        if (!user) {
                            throw new Error("Invalid User ID.");
                        }
                    },
                },
            },
        },
        { timestamps: true, tableName: "donors" }
    );

    Donor.associate = (models) => {
        Donor.belongsTo(models.Agency, {
            foreignKey: "agency_id",
        });
        Donor.belongsTo(models.User, {
            foreignKey: "user_id",
        });
        Donor.belongsTo(models.BloodType, {
            foreignKey: "blood_type_id",
        });
        Donor.belongsTo(models.User, {
            foreignKey: "verified_by",
        });
        // Donor.belongsTo(models.File, {
        //     foreignKey: "medical_history_file_id",
        // });
    };

    return Donor;
};

export default DonorModel;
