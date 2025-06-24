const NotificationModel = (sequelize, DataTypes) => {
    const Notification = sequelize.define(
        "Notification",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            subject: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
                defaultValue: "You have a new notification",
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "info",
            },
            reference_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            is_read: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            created_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },
        },
        { timestamps: true, tableName: "notifications" }
    );

    Notification.associate = (models) => {
        Notification.belongsTo(models.User, { foreignKey: "user_id" });
        Notification.belongsTo(models.User, { foreignKey: "created_by" });
    };

    return Notification;
};

export default NotificationModel;
