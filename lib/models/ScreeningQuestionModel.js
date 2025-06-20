const ScreeningQuestionModel = (sequelize, DataTypes) => {
    const ScreeningQuestion = sequelize.define(
        "ScreeningQuestion",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            question_text: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            question_type: {
                type: DataTypes.ENUM(
                    "GENERAL",
                    "MEDICAL",
                    "TRAVEL",
                    "LIFESTYLE"
                ),
                allowNull: false,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
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
            tableName: "screening_questions",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );

    ScreeningQuestion.associate = (models) => {
        ScreeningQuestion.hasMany(models.ScreeningDetail, {
            foreignKey: "question_id",
        });
    };

    return ScreeningQuestion;
};

export default ScreeningQuestionModel;
