const BloodDonationHistoryModel = (sequelize, DataTypes) => {
    const BloodDonationHistory = sequelize.define(
        "BloodDonationHistory",
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
            donor_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            previous_donation_count: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            previous_donation_volume: {
                type: DataTypes.DECIMAL,
                allowNull: false,
                defaultValue: 0,
            },
            updated_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },

        },
        {
            tableName: "blood_donation_history",
            timestamps: true,
        }
    );

    BloodDonationHistory.associate = (models) => {
        BloodDonationHistory.belongsTo(models.Donor, {
            foreignKey: "donor_id",
            as: "donor"
        });
        BloodDonationHistory.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user"
        });
    };

    return BloodDonationHistory;
};

export default BloodDonationHistoryModel;
