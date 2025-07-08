const AnnouncementModel = (sequelize, DataTypes) => {
    const Announcement = sequelize.define(
        "Announcement",
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
            agency_id: {
                type: DataTypes.INTEGER,
                allowNull: true, // null for admin/global announcements
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            body: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            is_public: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            file_url: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: "announcements",
            timestamps: true,
        }
    );

    Announcement.associate = (models) => {
        Announcement.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
        });
        Announcement.belongsTo(models.Agency, {
            foreignKey: "agency_id",
            as: "agency",
        });
    };

    return Announcement;
};

export default AnnouncementModel; 