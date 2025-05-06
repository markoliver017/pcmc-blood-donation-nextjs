const RouteMedicineModel = (sequelize, DataTypes) => {
    const RouteMedicine = sequelize.define(
        "RouteMedicine",
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
                        msg: "Medicine route is required.",
                    },
                },
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        { timestamps: true, tableName: "route_medicines" }
    );

    /* Define associations in the `associate` method */
    RouteMedicine.associate = (models) => {
        RouteMedicine.hasMany(models.ReportMedicineRoute, {
            foreignKey: "route_medicine_id",
        });
    };

    return RouteMedicine;
};

export default RouteMedicineModel;
