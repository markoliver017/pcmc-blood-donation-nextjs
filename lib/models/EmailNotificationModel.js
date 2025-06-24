const EmailNotificationModel = (sequelize, DataTypes) => {
    const EmailNotification = sequelize.define(
        "EmailNotification",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            recipients: {
                type: DataTypes.JSON, // Array of recipient email/user IDs
                allowNull: false,
            },
            cc: {
                type: DataTypes.JSON, // Array of CC email/user IDs
                allowNull: true,
            },
            subject: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            files: {
                type: DataTypes.JSON, // Array of file references
                allowNull: true,
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            created_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },
        },
        { timestamps: true, tableName: "email_notifications" }
    );

    EmailNotification.associate = (models) => {
        EmailNotification.belongsTo(models.User, {
            foreignKey: "created_by",
            onDelete: "SET NULL",
        });
    };

    return EmailNotification;
};

export default EmailNotificationModel;
