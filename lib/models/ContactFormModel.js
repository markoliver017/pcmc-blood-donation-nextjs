const ContactFormModel = (sequelize, DataTypes) => {
    const ContactForm = sequelize.define(
        "ContactForm",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Name is required.",
                    },
                    len: {
                        args: [2, 100],
                        msg: "Name must be between 2 and 100 characters.",
                    },
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: {
                        msg: "Please enter a valid email address.",
                    },
                    notEmpty: {
                        msg: "Email is required.",
                    },
                },
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 20],
                        msg: "Phone number must be less than 20 characters.",
                    },
                },
            },
            subject: {
                type: DataTypes.ENUM(
                    "General Inquiry",
                    "Blood Donation Appointment",
                    "Blood Drive Organization",
                    "Emergency Blood Request",
                    "Volunteer Opportunities",
                    "Partnership Inquiry",
                    "Technical Support",
                    "Other"
                ),
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Subject is required.",
                    },
                },
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Message is required.",
                    },
                    len: {
                        args: [10, 2000],
                        msg: "Message must be between 10 and 2000 characters.",
                    },
                },
            },
            status: {
                type: DataTypes.ENUM(
                    "pending",
                    "in_progress",
                    "resolved",
                    "closed"
                ),
                allowNull: false,
                defaultValue: "pending",
                validate: {
                    isIn: {
                        args: [
                            ["pending", "in_progress", "resolved", "closed"],
                        ],
                        msg: "Invalid status.",
                    },
                },
            },
            priority: {
                type: DataTypes.ENUM("low", "normal", "high", "urgent"),
                allowNull: false,
                defaultValue: "normal",
                validate: {
                    isIn: {
                        args: [["low", "normal", "high", "urgent"]],
                        msg: "Invalid priority level.",
                    },
                },
            },
            assigned_to: {
                type: DataTypes.UUID,
                allowNull: true,
                validate: {
                    async isValidUser(value) {
                        if (value) {
                            const User = sequelize.models.User;
                            const user = await User.findByPk(value);
                            if (!user) {
                                throw new Error("Invalid assigned user ID.");
                            }
                        }
                    },
                },
            },
            resolved_by: {
                type: DataTypes.UUID,
                allowNull: true,
                validate: {
                    async isValidUser(value) {
                        if (value) {
                            const User = sequelize.models.User;
                            const user = await User.findByPk(value);
                            if (!user) {
                                throw new Error("Invalid resolved by user ID.");
                            }
                        }
                    },
                },
            },
            resolved_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            admin_notes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        { timestamps: true, tableName: "contact_forms" }
    );

    ContactForm.associate = (models) => {
        ContactForm.belongsTo(models.User, {
            foreignKey: "assigned_to",
            as: "assignedUser",
        });
        ContactForm.belongsTo(models.User, {
            foreignKey: "resolved_by",
            as: "resolvedByUser",
        });
    };

    return ContactForm;
};

export default ContactFormModel;
