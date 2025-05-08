const AuditTrailModel = (sequelize, DataTypes) => {
    const AuditTrail = sequelize.define(
        "AuditTrail",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "User ID is required.",
                    },
                    async isValidUser(value) {
                        const User = sequelize.models.User;
                        if (!User) {
                            throw new Error("User model is not available.");
                        }
                        if (value) {
                            const user = await User.findByPk(value);
                            if (!user) {
                                throw new Error("Invalid User ID.");
                            }
                        }
                    },
                },
            },
            controller: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            action: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            is_error: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            details: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            ip_address: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isIP: true,
                },
            },
            user_agent: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            stack_trace: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        { timestamps: true, tableName: "audit_trails" }
    );

    AuditTrail.associate = (models) => {
        AuditTrail.belongsTo(models.User, {
            foreignKey: "user_id",
        });
    };

    return AuditTrail;
};

export default AuditTrailModel;
