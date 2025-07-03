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
            },
            category: {
                type: DataTypes.ENUM(
                    "AGENCY_REGISTRATION",
                    "AGENCY_APPROVAL",
                    "DONOR_REGISTRATION",
                    "DONOR_APPROVAL",
                    "EVENT_CREATION",
                    "APPOINTMENT_BOOKING",
                    "BLOOD_COLLECTION",
                    "SYSTEM_NOTIFICATION",
                    "GENERAL"
                ),
                allowNull: false,
            },
            subject: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            html_content: {
                type: DataTypes.TEXT,
                allowNull: false,
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
        { timestamps: true, tableName: "email_templates" }
    );

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
