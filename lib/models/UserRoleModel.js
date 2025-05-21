const UserRoleModel = (sequelize, DataTypes) => {
    const UserRole = sequelize.define(
        "UserRole",
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            user_id: { type: DataTypes.UUID, allowNull: false },
            role_id: { type: DataTypes.INTEGER, allowNull: false },
            is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        },
        { timestamps: true, tableName: "user_roles" }
    );


    UserRole.associate = (models) => {
        UserRole.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
            onDelete: "CASCADE",
        });
        UserRole.belongsTo(models.Role, {
            foreignKey: "role_id",
            as: "role",
            onDelete: "CASCADE",
        });
    };

    return UserRole;
};

export default UserRoleModel;


// Include UserRoleModel when querying Users
// const users = await UserModel.findAll({
//     include: [{ model: RoleModel, as: "roles" }],
// });


//********** Add Users with their roles / appends
// const user = await UserModel.create({ name: "John Doe" });
// await user.addRoles([1, 2]);

//********** Update roles for a User / overwrites existing
// const user = await UserModel.findByPk(userId);
// await user.setRoles([2, 3]); // Overwrites with new role IDs 2 and 3
