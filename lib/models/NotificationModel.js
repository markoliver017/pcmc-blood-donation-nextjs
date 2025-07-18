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
                    "AGENCY_APPROVAL", // MBDT for new agency notification that needs approval  //  for agencyHead that approves its application
                    "AGENCY_STATUS_UPDATE",
                    "AGENCY_COORDINATOR_APPROVAL", // for agencyhead new coordinator notification that needs approval  //  for coordinator that approves its application
                    "COORDINATOR_REGISTRATION",
                    "COORDINATOR_STATUS_UPDATE",
                    "AGENCY_DONOR_APPROVAL", // for agency head and coordinators when new donor registers
                    "DONOR_REGISTRATION",
                    "DONOR_STATUS_UPDATE",
                    "BLOOD_DRIVE_APPROVAL",
                    "BLOOD_DRIVE_STATUS_UPDATE",
                    "GENERAL",
                    "APPOINTMENT",
                    "COLLECTION",
                    "SYSTEM",
                    "CONTACT_FORM",
                    "CONTACT_FORM_ASSIGNED",
                    "NEW_EVENT", // for donors when a new blood donation event is created
                    "BLOOD_REQUEST_APPROVAL" // for blood request status updates
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
        Notification.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
        });
        Notification.belongsTo(models.User, {
            foreignKey: "created_by",
            as: "created_by_user",
            onDelete: "SET NULL",
        });
    };

    return Notification;
};

export default NotificationModel;
