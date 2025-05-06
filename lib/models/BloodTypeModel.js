const BloodTypeModel = (sequelize, DataTypes) => {
    const BloodType = sequelize.define(
        "BloodType",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            blood_type: { type: DataTypes.STRING(3), allowNull: false },
        },
        {
            timestamps: false,
            tableName: "blood_types",
        }
    );

    // Define associations in the `associate` method
    // BloodType.associate = (models) => {
    //     BloodType.hasMany(models.User, {
    //         foreignKey: "blood_type_id",
    //     });
    // };

    return BloodType;
};

export default BloodTypeModel;
