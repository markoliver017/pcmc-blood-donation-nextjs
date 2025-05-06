const GenericMedicineModel = (sequelize, DataTypes) => {
    const GenericMedicine = sequelize.define(
        "GenericMedicine",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Medicine generic name is required.",
                    },
                },
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        { timestamps: true, tableName: "generic_medicines" }
    );

    /* Define associations in the `associate` method */
    GenericMedicine.associate = (models) => {
        GenericMedicine.hasMany(models.ReportMedicineRoute, {
            foreignKey: "generic_medicine_id",
        });
    };

    return GenericMedicine;
};

export default GenericMedicineModel;
