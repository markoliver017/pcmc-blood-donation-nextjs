const AgencyModel = (sequelize, DataTypes) => {
    const Agency = sequelize.define(
        "Agency",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            head_id: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Agency Head is required.",
                    },
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
            },
            file_url: {
                type: DataTypes.TEXT,
                allowNull: true,
                // validate: {
                //     async isValidFile(value) {
                //         const File = sequelize.models.File; // Get Role model from sequelize
                //         if (!File) {
                //             throw new Error("File model is not available.");
                //         }
                //         if (value) {
                //             const file = await File.findByPk(value);
                //             if (!file) {
                //                 throw new Error("Invalid file ID.");
                //             }
                //         }
                //     },
                // },
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    msg: "Agency name is already associated with another agency.",
                },
                validate: {
                    notEmpty: {
                        msg: "Agency name is required.",
                    },
                },
            },
            contact_number: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isNumeric: {
                        msg: "Contact number must contain only numbers.",
                    },
                    notEmpty: {
                        msg: "Contact number is required.",
                    },
                },
            },
            // agency_email: {
            //     type: DataTypes.STRING,
            //     allowNull: false,
            //     unique: {
            //         msg: "Email address is already associated with another agency.",
            //     },
            //     validate: {
            //         isEmail: {
            //             msg: "Invalid email format.",
            //         },
            //         notEmpty: {
            //             msg: "Email is required.",
            //         },
            //     },
            // },
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
                        msg: "City/Municipality is required.",
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
            comments: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            remarks: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM(
                    "for approval",
                    "rejected",
                    "activated",
                    "deactivated"
                ),
                allowNull: false,
                defaultValue: "for approval",
                validate: {
                    isIn: {
                        args: [
                            [
                                "for approval",
                                "rejected",
                                "activated",
                                "deactivated",
                            ],
                        ],
                        msg: "Invalid status type.",
                    },
                },
            },
            verified_by: {
                type: DataTypes.UUID,
                allowNull: true,
                validate: {
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
            },
            updated_by: {
                type: DataTypes.UUID,
                allowNull: true,
                validate: {
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
            },
            organization_type: {
                type: DataTypes.ENUM(
                    "business",
                    "media",
                    "government",
                    "church",
                    "education",
                    "healthcare"
                ),
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Organization type is required.",
                    },
                    isIn: {
                        args: [
                            [
                                "business",
                                "media",
                                "government",
                                "church",
                                "education",
                                "healthcare",
                            ],
                        ],
                        msg: "Invalid organization type.",
                    },
                },
            },
        },
        { timestamps: true, tableName: "agencies" }
    );

    Agency.associate = (models) => {
        Agency.belongsTo(models.User, {
            foreignKey: "head_id",
            as: "head",
        });

        Agency.belongsTo(models.User, {
            foreignKey: "updated_by",
            onDelete: "SET NULL",
            as: "creator",
        });
    };

    return Agency;
};

export default AgencyModel;
