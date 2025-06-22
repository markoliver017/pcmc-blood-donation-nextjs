const BloodDonationCollectionModel = (sequelize, DataTypes) => {
    const BloodDonationCollection = sequelize.define(
        "BloodDonationCollection",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            appointment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            donor_id: {
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

            volume: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                validate: {
                    min: 10,
                    max: 1000,
                },
            },
            // collection_method: {
            //     type: DataTypes.ENUM("whole blood", "apheresis"),
            //     allowNull: false,
            //     defaultValue: "whole blood",
            //     validate: {
            //         isIn: {
            //             args: [["whole blood", "apheresis"]],
            //             msg: "Collection method must be either 'whole blood' or 'apheresis'.",
            //         },
            //     },
            // },
            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            collector_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            updated_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },

        },
        {
            tableName: "blood_donation_collections",
            timestamps: true,
        }
    );

    BloodDonationCollection.associate = (models) => {
        BloodDonationCollection.belongsTo(models.Donor, {
            foreignKey: "donor_id",
            as: "donor"
        });

        BloodDonationCollection.belongsTo(models.DonorAppointmentInfo, {
            foreignKey: "appointment_id",
            as: "appointment"
        });

        BloodDonationCollection.belongsTo(models.BloodDonationEvent, {
            foreignKey: "event_id",
            as: "event"
        });

        BloodDonationCollection.belongsTo(models.PhysicalExamination, {
            foreignKey: "physical_examination_id",
            as: "exam"
        });
        BloodDonationCollection.belongsTo(models.User, {
            foreignKey: "collector_id",
            as: "collector"
        });
    };

    return BloodDonationCollection;
};

export default BloodDonationCollectionModel;
