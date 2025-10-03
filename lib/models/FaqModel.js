const FaqModel = (sequelize, DataTypes) => {
    const Faq = sequelize.define(
        "faq",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            question: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            answer: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            category: {
                type: DataTypes.ENUM(
                    "general",
                    "donation_process",
                    "eligibility",
                    "health_safety",
                    "appointments",
                    "account",
                    "blood_types",
                    "after_donation"
                ),
                allowNull: false,
                defaultValue: "general",
            },
            keywords: {
                type: DataTypes.JSON, // Store as JSON array
                allowNull: true,
                defaultValue: [],
            },
            display_order: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            created_by: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            updated_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },
        },
        {
            tableName: "faqs",
            timestamps: true,
        }
    );

    Faq.associate = (models) => {
        Faq.belongsTo(models.User, {
            foreignKey: "created_by",
            as: "creator",
        });
        Faq.belongsTo(models.User, {
            foreignKey: "updated_by",
            as: "updater",
        });
    };

    return Faq;
};

export default FaqModel;
