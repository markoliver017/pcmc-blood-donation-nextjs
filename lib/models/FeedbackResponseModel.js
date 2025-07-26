const FeedbackResponseModel = (sequelize, DataTypes) => {
    const FeedbackResponse = sequelize.define(
        "feedback_response",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
        },
        {
            timestamps: true,
            tableName: "feedback_responses",
        }
    );

    FeedbackResponse.associate = (models) => {
        FeedbackResponse.belongsTo(models.DonorAppointmentInfo, {
            foreignKey: {
                name: "donor_appointment_id",
                allowNull: false,
            },
            as: "appointment",
            onDelete: "CASCADE",
        });

        FeedbackResponse.belongsTo(models.FeedbackQuestion, {
            foreignKey: {
                name: "feedback_question_id",
                allowNull: false,
            },
            as: "question",
            onDelete: "CASCADE",
        });
    };

    return FeedbackResponse;
};

export default FeedbackResponseModel;
