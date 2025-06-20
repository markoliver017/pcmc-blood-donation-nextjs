const BloodDonationCollectionModel = (sequelize, DataTypes) => {
    const BloodDonationCollection = sequelize.define(
        "BloodDonationCollection",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            donor_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            appointment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            event_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            physical_examination_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            collector_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            volume: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                validate: {
                    min: 10,
                    max: 1000,
                },
            },
            collection_method: {
                type: DataTypes.ENUM("whole blood", "apheresis"),
                allowNull: false,
                defaultValue: "whole blood",
                validate: {
                    isIn: {
                        args: [["whole blood", "apheresis"]],
                        msg: "Collection method must be either 'whole blood' or 'apheresis'.",
                    },
                },
            },
            remarks: {
                type: DataTypes.TEXT,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
            },
        },
        {
            tableName: "blood_donation_collections",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );

    BloodDonationCollection.associate = (models) => {
        BloodDonationCollection.belongsTo(models.Donor, {
            foreignKey: "donor_id",
        });

        BloodDonationCollection.belongsTo(models.DonorAppointmentInfo, {
            foreignKey: "appointment_id",
        });

        BloodDonationCollection.belongsTo(models.BloodDonationEvent, {
            foreignKey: "event_id",
        });

        BloodDonationCollection.belongsTo(models.PhysicalExamination, {
            foreignKey: "physical_examination_id",
        });
        BloodDonationCollection.belongsTo(models.User, {
            foreignKey: "collector_id",
        });
    };

    return BloodDonationCollection;
};

export default BloodDonationCollectionModel;
