// models/report_medicine_route.js
const ReportMedicineRouteModel = (sequelize, DataTypes) => {
    const ReportMedicineRoute = sequelize.define(
        "ReportMedicineRoute",
        {
            report_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    async isValidReport(value) {
                        const Report = sequelize.models.Report; // Get Role model from sequelize
                        if (!Report) {
                            throw new Error("Report model is not available.");
                        }
                        const report = await Report.findByPk(value);
                        if (!report) {
                            throw new Error("Invalid report field value.");
                        }
                    },
                },
            },
            generic_medicine_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    async isValidMedicine(value) {
                        const GenericMedicine =
                            sequelize.models.GenericMedicine; // Get Role model from sequelize
                        if (!GenericMedicine) {
                            throw new Error(
                                "GenericMedicine model is not available."
                            );
                        }
                        const medicine = await GenericMedicine.findByPk(value);
                        if (!medicine) {
                            throw new Error(
                                "Invalid generic medicine field value."
                            );
                        }
                    },
                },
            },
            route_medicine_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    async isValidRoute(value) {
                        const RouteMedicine = sequelize.models.RouteMedicine; // Get Role model from sequelize
                        if (!RouteMedicine) {
                            throw new Error(
                                "RouteMedicine model is not available."
                            );
                        }
                        const route = await RouteMedicine.findByPk(value);
                        if (!route) {
                            throw new Error(
                                "Invalid medicine route field value."
                            );
                        }
                    },
                },
            },
            other_generic_medicine: {
                type: DataTypes.STRING(250),
                allowNull: true,
                validate: {
                    async isRequiredIfOthers(value) {
                        const generic_medicine_id = this.generic_medicine_id;
                        const GenericMedicine =
                            sequelize.models.GenericMedicine; // Get Role model from sequelize
                        if (!GenericMedicine) {
                            throw new Error(
                                "GenericMedicine model is not available."
                            );
                        }
                        const medicine = await GenericMedicine.findByPk(
                            generic_medicine_id
                        );
                        if (!medicine) {
                            throw new Error(
                                "Invalid generic medicine field value."
                            );
                        }

                        if (medicine.name == "Others" && !value) {
                            throw new Error(
                                "Please specify the other generic medicine when selecting 'Others' in generic medicine select field."
                            );
                        }
                    },
                },
            },
            other_medicine_route: {
                type: DataTypes.STRING(250),
                allowNull: true,
                validate: {
                    async isRequiredIfOthers(value) {
                        const route_medicine_id = this.route_medicine_id;
                        const RouteMedicine = sequelize.models.RouteMedicine; // Get Role model from sequelize
                        if (!RouteMedicine) {
                            throw new Error(
                                "RouteMedicine model is not available."
                            );
                        }
                        const route = await RouteMedicine.findByPk(
                            route_medicine_id
                        );
                        if (!route) {
                            throw new Error(
                                "Invalid medicine route field value."
                            );
                        }

                        if (route.name == "Others" && !value) {
                            throw new Error(
                                "Please specify the other medicine route when selecting 'Others' in medicine route select field."
                            );
                        }
                    },
                },
            },
        },
        {
            tableName: "report_medicine_routes",
            timestamps: false,
        }
    );

    ReportMedicineRoute.associate = (models) => {
        ReportMedicineRoute.belongsTo(models.Report, {
            foreignKey: "report_id",
            onDelete: "CASCADE",
        });

        ReportMedicineRoute.belongsTo(models.GenericMedicine, {
            foreignKey: "generic_medicine_id",
            onDelete: "CASCADE",
        });

        ReportMedicineRoute.belongsTo(models.RouteMedicine, {
            foreignKey: "route_medicine_id",
            onDelete: "CASCADE",
        });
    };

    return ReportMedicineRoute;
};

export default ReportMedicineRouteModel;
