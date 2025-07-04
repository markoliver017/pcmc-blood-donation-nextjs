const EmailTemplateModel = (sequelize, DataTypes) => {
    const EmailTemplate = sequelize.define(
        "EmailTemplate",
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
                    notNull: {
                        msg: "Template name is required",
                    },
                    notEmpty: {
                        msg: "Template name cannot be empty",
                    },
                    len: {
                        args: [1, 255],
                        msg: "Template name must be between 1 and 255 characters",
                    },
                },
            },
            category: {
                type: DataTypes.ENUM(
                    "AGENCY_REGISTRATION",
                    "AGENCY_COORDINATOR_REGISTRATION",
                    "AGENCY_COORDINATOR_APPROVAL",
                    "AGENCY_COORDINATOR_REGISTRATION_NOTIFICATION_TO_AGENCY",
                    "AGENCY_APPROVAL",
                    "DONOR_REGISTRATION",
                    "DONOR_APPROVAL",
                    "EVENT_CREATION",
                    "APPOINTMENT_BOOKING",
                    "BLOOD_COLLECTION",
                    "SYSTEM_NOTIFICATION",
                    "MBDT_NOTIFICATION",
                    "GENERAL"
                ),
                defaultValue: "GENERAL",
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Email template category is required",
                    },
                    notEmpty: {
                        msg: "Email template category cannot be empty",
                    },
                },
            },
            subject: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Email subject is required",
                    },
                    notEmpty: {
                        msg: "Email subject cannot be empty",
                    },
                    len: {
                        args: [1, 500],
                        msg: "Email subject must be between 1 and 500 characters",
                    },
                },
            },
            html_content: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "HTML content is required",
                    },
                    notEmpty: {
                        msg: "HTML content cannot be empty",
                    },
                },
            },
            text_content: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            dynamic_fields: {
                type: DataTypes.JSON,
                allowNull: true,
                comment: "Array of available dynamic fields for this template",
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            created_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            updated_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },
        },
        {
            timestamps: true,
            tableName: "email_templates",
            indexes: [
                {
                    unique: true,
                    fields: ["name", "category"],
                    name: "email_templates_name_category_unique",
                },
            ],
        }
    );

    // Model-level validation hooks
    EmailTemplate.addHook("beforeValidate", () => {
        // Custom validation logic can be added here
    });

    EmailTemplate.addHook("beforeCreate", async (instance) => {
        // Check for duplicate name + category combination
        const existingTemplate = await EmailTemplate.findOne({
            where: {
                name: instance.name,
                category: instance.category,
            },
        });

        if (existingTemplate) {
            throw new Error(
                `A template with name "${instance.name}" already exists for category "${instance.category}". Please choose a different name.`
            );
        }
    });

    EmailTemplate.addHook("beforeUpdate", async (instance) => {
        // Check for duplicate name + category combination (excluding current record)
        const existingTemplate = await EmailTemplate.findOne({
            where: {
                name: instance.name,
                category: instance.category,
                id: { [sequelize.Sequelize.Op.ne]: instance.id },
            },
        });

        if (existingTemplate) {
            throw new Error(
                `A template with name "${instance.name}" already exists for category "${instance.category}". Please choose a different name.`
            );
        }
    });

    EmailTemplate.associate = (models) => {
        EmailTemplate.belongsTo(models.User, {
            foreignKey: "created_by",
            as: "created_by_user",
            onDelete: "SET NULL",
        });
        EmailTemplate.belongsTo(models.User, {
            foreignKey: "updated_by",
            as: "updated_by_user",
            onDelete: "SET NULL",
        });
    };

    return EmailTemplate;
};

export default EmailTemplateModel;
