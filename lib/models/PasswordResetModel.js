const PasswordResetModel = (sequelize, DataTypes) => {
    const PasswordReset = sequelize.define(
        "PasswordReset",
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
                        const User = sequelize.models.user;
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
            token: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: {
                        msg: "Token is required.",
                    },
                },
            },
            expires_at: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Expiration date is required.",
                    },
                    isFutureDate(value) {
                        if (value && new Date(value) <= new Date()) {
                            throw new Error("Expiration date must be in the future.");
                        }
                    },
                },
            },
            used: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        { 
            timestamps: true, 
            tableName: "password_resets",
            indexes: [
                {
                    fields: ['token'],
                    unique: true,
                },
                {
                    fields: ['user_id'],
                },
                {
                    fields: ['expires_at'],
                },
                {
                    fields: ['used'],
                },
            ],
        }
    );

    PasswordReset.associate = (models) => {
        PasswordReset.belongsTo(models.User, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
        });
    };

    return PasswordReset;
};

export default PasswordResetModel; 