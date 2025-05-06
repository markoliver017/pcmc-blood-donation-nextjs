const ErrorTypeModel = (sequelize, DataTypes) => {
    const ErrorType = sequelize.define(
        "ErrorType",
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
                        msg: "Medication error name is required.",
                    },
                },
            },
            is_medicine_needed: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        { timestamps: true, tableName: "error_types" }
    );

    /* Define associations in the `associate` method */
    ErrorType.associate = (models) => {
        ErrorType.hasMany(models.Report, {
            foreignKey: "error_type_id",
        });
    };

    return ErrorType;
};

export default ErrorTypeModel;
