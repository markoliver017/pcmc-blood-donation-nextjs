const ReportModel = (sequelize, DataTypes) => {
    const Report = sequelize.define(
        "Report",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            report_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Report Date is required.",
                    },
                    isDate: {
                        msg: "Report Date must be a valid date.",
                    },
                },
            },
            error_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Medication Error Date field is required.",
                    },
                    isDate: {
                        msg: "Medication Error Date field must be a valid date.",
                    },
                },
            },
            patient_age: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Patient Age is required.",
                    },
                },
            },
            patient_sex: {
                type: DataTypes.ENUM("male", "female", "unknown"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["male", "female", "unknown"]],
                        msg: "Patient Sex must be either Male, Female or unknown.",
                    },
                    notEmpty: {
                        msg: "Patient Sex is required.",
                    },
                },
            },
            patient_weight: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                validate: {
                    isDecimal: {
                        msg: "Patient Weight must be a decimal value.",
                    },
                    min: {
                        args: [0],
                        msg: "Patient Weight must be a positive value.",
                    },
                    notEmpty: {
                        msg: "Patient Weight is required.",
                    },
                },
            },
            patient_height: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Patient Height is required.",
                    },
                },
            },
            age_unit: {
                type: DataTypes.ENUM("Year", "Month", "Week", "Day", "Hour"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["Year", "Month", "Week", "Day", "Hour"]],
                        msg: "Invalid age unit.",
                    },
                    notEmpty: {
                        msg: "Age unit is required.",
                    },
                },
            },
            weight_unit: {
                type: DataTypes.ENUM("kg", "lb"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["kg", "lb"]],
                        msg: "Invalid weight unit.",
                    },
                    notEmpty: {
                        msg: "Weight unit is required.",
                    },
                },
            },
            height_unit: {
                type: DataTypes.ENUM("cm", "m", "in", "ft"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["cm", "m", "in", "ft"]],
                        msg: "Invalid weight unit.",
                    },
                    notEmpty: {
                        msg: "Weight unit is required.",
                    },
                },
            },
            exact_prescription: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Exact Prescription is required.",
                    },
                },
            },
            error_type_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    async isValidErrorType(value) {
                        const Type = sequelize.models.ErrorType; // Get Role model from sequelize
                        if (!Type) {
                            throw new Error(
                                "Error type model is not available."
                            );
                        }
                        const type = await Type.findByPk(value);
                        if (!type) {
                            throw new Error("Error type field is required.");
                        }
                    },
                },
            },
            other_error_type: {
                type: DataTypes.TEXT,
                validate: {
                    async isRequiredIfOthers(value) {
                        const errorTypeId = this.error_type_id;
                        const Type = sequelize.models.ErrorType;
                        if (!Type) {
                            throw new Error(
                                "Error type model is not available."
                            );
                        }
                        const type = await Type.findByPk(errorTypeId);
                        if (!type) {
                            throw new Error("Error type field is required.");
                        }

                        if (type.name == "Others" && !value) {
                            throw new Error(
                                "Please specify the other type of error when selecting 'Others' as the error type."
                            );
                        }
                    },
                },
            },
            incident_description: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Description of the medication error incident is required.",
                    },
                },
            },
            workplace_environment: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Description of the workplace environment is required.",
                    },
                },
            },
            patient_condition: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Description of the patient condition is required.",
                    },
                },
            },
            immediate_actions: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Description of the immediate action/s done is required.",
                    },
                },
            },
            corrective_actions: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Description of the corrective action/s done is required.",
                    },
                },
            },
            preventive_actions: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Description of the preventive action/s done is required.",
                    },
                },
            },
            is_verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                // validate: {
                //     isVerified(value) {
                //         if (!value || value == 0 || value == false) {
                //             throw new Error(
                //                 "Please review and verify the details of the medication error incident."
                //             );
                //         }
                //     },
                // },
            },
        },
        { timestamps: true, tableName: "reports" }
    );

    /* Define associations in the `associate` method */
    Report.associate = (models) => {
        Report.belongsTo(models.ErrorType, {
            foreignKey: "error_type_id",
            as: "error_type",
            onDelete: "RESTRICT",
        });

        Report.hasMany(models.ReportMedicineRoute, {
            foreignKey: "report_id",
            onDelete: "CASCADE",
        });
    };
    return Report;
};

export default ReportModel;
