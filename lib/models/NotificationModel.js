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
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            subject: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
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
                type: DataTypes.INTEGER,
                allowNull: false,
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
