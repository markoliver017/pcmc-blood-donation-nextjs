const RoleModel = (sequelize, DataTypes) => {
    const Role = sequelize.define(
        "Role",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            role_name: {
                type: DataTypes.STRING(50),
                allowNull: true,
                set(value) {
                    const formatted = value
                        .toLowerCase()
                        .split(" ")
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ");

                    this.setDataValue("role_name", formatted);
                },
                validate: {
                    isValid(value) {
                        if (value && !/^[A-Za-z\s]+$/.test(value)) {
                            throw new Error(
                                "Role Name can only contain letters."
                            );
                        }
                    },
                    notEmpty: {
                        msg: "Role field is required.",
                    },
                },
            },
            url: {
                type: DataTypes.STRING(150),
                allowNull: false,
                defaultValue: "/portal",
                validate: {
                    notEmpty: {
                        msg: "Url field is required.",
                    },
                },
            },
            icon: {
                type: DataTypes.STRING(150),
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Icon field is required.",
                    },
                },
            },
        },
        { timestamps: true, tableName: "roles" }
    );
    Role.associate = (models) => {
        Role.belongsToMany(models.User, {
            through: models.UserRole,
            foreignKey: "role_id",
            otherKey: 'user_id',
            as: "users",
            onDelete: "CASCADE",
        });
    };

    return Role;
};

export default RoleModel;
