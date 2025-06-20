const ScreeningDetailModel = (sequelize, DataTypes) => {
    const ScreeningDetail = sequelize.define(
        "ScreeningDetail",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            physical_examination_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            question_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            response: {
                type: DataTypes.ENUM("YES", "NO", "N/A"),
                allowNull: false,
            },
            additional_info: {
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
            tableName: "screening_details",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );

    ScreeningDetail.associate = (models) => {
        ScreeningDetail.belongsTo(models.PhysicalExamination, {
            foreignKey: "physical_examination_id",
        });

        ScreeningDetail.belongsTo(models.ScreeningQuestion, {
            foreignKey: "question_id",
        });
    };

    return ScreeningDetail;
};

export default ScreeningDetailModel;
