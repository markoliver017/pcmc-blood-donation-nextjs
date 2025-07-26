const FeedbackQuestionModel = (sequelize, DataTypes) => {
    const FeedbackQuestion = sequelize.define(
        "feedback_question",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            question_text: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Question text cannot be empty.",
                    },
                },
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            },
        },
        {
            timestamps: true,
            tableName: "feedback_questions",
        }
    );

    FeedbackQuestion.associate = (models) => {
        FeedbackQuestion.hasMany(models.FeedbackResponse, {
            foreignKey: "feedback_question_id",
            as: "responses",
        });
    };

    return FeedbackQuestion;
};

export default FeedbackQuestionModel;
