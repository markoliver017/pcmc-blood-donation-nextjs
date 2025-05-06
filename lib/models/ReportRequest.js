const ReportRequestModel = (sequelize, DataTypes) => {
    const ReportRequest = sequelize.define(
        "ReportRequest",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            request_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    isDate: true,
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
                    notEmpty: true,
                    len: [5, 255],
                },
            },
            company: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 100],
                },
            },
            profession: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 100],
                },
            },
            purpose: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 250],
                },
            },
            status: {
                type: DataTypes.ENUM("approved", "rejected", "pending"),
                allowNull: false,
                defaultValue: "pending",
                validate: {
                    isIn: {
                        args: [["approved", "rejected", "pending"]],
                        msg: "Status must be one of: approved, rejected, pending",
                    },
                },
            },
            approved_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        { timestamps: true, tableName: "report_request" }
    );

    /* Define associations in the `associate` method */
    ReportRequest.associate = (models) => {
        ReportRequest.belongsTo(models.Admin, {
            foreignKey: "approved_by",
            onDelete: "SET NULL",
        });
    };

    return ReportRequest;
};

export default ReportRequestModel;
