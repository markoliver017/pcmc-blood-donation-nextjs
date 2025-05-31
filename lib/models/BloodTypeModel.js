const BloodTypeModel = (sequelize, DataTypes) => {
    const BloodType = sequelize.define(
        "BloodType",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            blood_type: { type: DataTypes.STRING(10), allowNull: false },
        },
        {
            timestamps: false,
            tableName: "blood_types",
        }
    );

    // Define associations in the `associate` method
    BloodType.associate = (models) => {
        BloodType.hasMany(models.Donor, {
            foreignKey: "blood_type_id",
        });
    };

    return BloodType;
};

export default BloodTypeModel;
