const BloodRequestModel = (sequelize, DataTypes) => {
    const BloodRequest = sequelize.define(
        "BloodRequest",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
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
            patient_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 255],
                },
            },
            purpose: {
                type: DataTypes.TEXT,
                allowNull: true,
                validate: {
                    notEmpty: true,
                },
            },
            blood_type_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
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
            quantity_needed: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: true,
                    min: 1,
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
            hospital_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 255],
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
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Barangay is required.",
                    },
                },
            },
            city: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "City is required.",
                    },
                },
            },
            zip_code: {
                type: DataTypes.STRING(10),
                allowNull: false,
                validate: {
                    isNumeric: {
                        msg: "Zip Code must be numeric.",
                    },
                    notEmpty: {
                        msg: "Zip Code is required.",
                    },
                },
            },
            country: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue: "Philippines",
                validate: {
                    notEmpty: {
                        msg: "Country is required.",
                    },
                },
            },
            status: {
                type: DataTypes.ENUM("pending", "fulfilled", "expired"),
                defaultValue: "pending",
                validate: {
                    isIn: [["pending", "fulfilled", "expired"]],
                },
            },
            file_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    isInt: true,
                    min: 1,
                },
            },
        },
        {
            tableName: "blood_requests",
            timestamps: true,
        }
    );

    BloodRequest.associate = (models) => {
        BloodRequest.belongsTo(models.User, {
            foreignKey: "user_id",
        });
        BloodRequest.belongsTo(models.File, { foreignKey: "file_id" });
        BloodRequest.belongsTo(models.BloodType, {
            foreignKey: "blood_type_id",
        });
    };

    return BloodRequest;
};

export default BloodRequestModel;
