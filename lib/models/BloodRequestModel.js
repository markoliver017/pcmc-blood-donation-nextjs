const BloodRequestModel = (sequelize, DataTypes) => {
    const BloodRequest = sequelize.define(
        "BloodRequest",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            agency_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: true,
                validate: {
                    async isValidUser(value) {
                        if (!value) return;
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
            blood_component: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            patient_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            patient_date_of_birth: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            patient_gender: {
                type: DataTypes.ENUM("male", "female"),
                allowNull: true,
                defaultValue: "male",
                validate: {
                    isIn: {
                        args: [["male", "female"]],
                        msg: "Invalid sex type.",
                    },
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
            no_of_units: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: true,
                    min: 1,
                },
            },
            diagnosis: {
                type: DataTypes.TEXT,
                allowNull: false,
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
            status: {
                type: DataTypes.ENUM("pending", "fulfilled", "expired", "cancelled"),
                defaultValue: "pending",
                validate: {
                    isIn: [["pending", "fulfilled", "expired", "cancelled"]],
                },
            },
            file_url: {
                type: DataTypes.TEXT,
                allowNull: true,
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
            as: "user",
        });
        // BloodRequest.belongsTo(models.File, { foreignKey: "file_id" });
        BloodRequest.belongsTo(models.BloodType, {
            foreignKey: "blood_type_id",
            as: "blood_type",
        });

        BloodRequest.belongsTo(models.Agency, {
            foreignKey: "agency_id",
            as: "agency",
        });
    };

    return BloodRequest;
};

export default BloodRequestModel;
