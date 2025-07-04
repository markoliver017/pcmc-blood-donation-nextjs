// NotificationModel.js
// Sequelize model for user notifications in the PCMC Pediatric Blood Center portal.
// Notification types: AGENCY_APPROVAL, BLOOD_DRIVE_APPROVAL, GENERAL, APPOINTMENT, COLLECTION, SYSTEM

const NotificationModel = (sequelize, DataTypes) => {
    const Notification = sequelize.define(
        "Notification",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            // Foreign key to the user it belongs to (if applicable)
            user_id: {
                type: DataTypes.UUID,
                allowNull: true,
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
                type: DataTypes.ENUM(
                    "AGENCY_APPROVAL",
                    "AGENCY_COORDINATOR_REGISTRATION",
                    "AGENCY_COORDINATOR_APPROVAL",
                    "AGENCY_COORDINATOR_REGISTRATION_NOTIFICATION_TO_AGENCY",
                    "BLOOD_DRIVE_APPROVAL",
                    "GENERAL",
                    "APPOINTMENT",
                    "COLLECTION",
                    "SYSTEM"
                ),
                allowNull: false,
                defaultValue: "GENERAL",
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
        Notification.belongsTo(models.User, {
            foreignKey: "created_by",
            onDelete: "SET NULL",
        });
    };

    return Notification;
};

export default NotificationModel;
