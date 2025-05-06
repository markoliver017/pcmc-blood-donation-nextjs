// models/report_medicine_route.js
const SubMenuModel = (sequelize, DataTypes) => {
    const Submenu = sequelize.define(
        "Submenu",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            menu_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(150),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "Name cannot be empty" },
                },
            },
            has_child: {
                type: DataTypes.STRING(10),
                allowNull: false,
                defaultValue: false,
                validate: {
                    notEmpty: { msg: "Has child cannot be empty" },
                },
            },
            link: {
                type: DataTypes.STRING(150),
                allowNull: true,
                validate: {
                    customValidator(value) {
                        if (
                            this.has_child !== undefined &&
                            this.has_child == 0 &&
                            !value
                        ) {
                            throw new Error(
                                "Link is required when has_child is set to 'No'"
                            );
                        }
                    },
                },
            },
            icon: {
                type: DataTypes.STRING(100),
                allowNull: false,
                defaultValue: "FaHome",
                validate: {
                    notEmpty: { msg: "Icon cannot be empty" },
                },
            },
            ctr: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            created_date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            mod_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            mod_date: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: DataTypes.NOW,
                onUpdate: DataTypes.NOW,
            },
        },
        {
            tableName: "sub_menu",
            timestamps: true,
        }
    );
    Submenu.associate = (models) => {
        Submenu.belongsTo(models.Menu, {
            foreignKey: "menu_id",
            onDelete: "RESTRICT",
        });
    };

    return Submenu;
};

export default SubMenuModel;
