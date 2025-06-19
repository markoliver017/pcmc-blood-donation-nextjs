const PhysicalExaminationModel = (sequelize, DataTypes) => {
    const PhysicalExamination = sequelize.define(
        "PhysicalExamination",
        {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            donor_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            appointment_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            event_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            examiner_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            examination_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            blood_pressure: {
                type: DataTypes.STRING(20),
            },
            pulse_rate: {
                type: DataTypes.INTEGER,
            },
            hemoglobin_level: {
                type: DataTypes.DECIMAL(5, 2),
            },
            weight: {
                type: DataTypes.DECIMAL(5, 2),
            },
            temperature: {
                type: DataTypes.DECIMAL(4, 1),
            },
            eligibility_status: {
                type: DataTypes.ENUM("ELIGIBLE", "INELIGIBLE", "DEFERRED"),
                allowNull: false,
                defaultValue: "ELIGIBLE",
            },
            deferral_reason: {
                type: DataTypes.TEXT,
            },
            notes: {
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
            tableName: "physical_examination",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );

    PhysicalExamination.associate = (models) => {
        PhysicalExamination.belongsTo(models.Donor, {
            foreignKey: "donor_id",
        });

        PhysicalExamination.belongsTo(models.DonorsAppointmentInfo, {
            foreignKey: "appointment_id",
        });

        PhysicalExamination.belongsTo(models.BloodDonationEvent, {
            foreignKey: "event_id",
        });

        PhysicalExamination.belongsTo(models.User, {
            foreignKey: "examiner_id",
        });
    };

    return PhysicalExamination;
};

export default PhysicalExaminationModel;
