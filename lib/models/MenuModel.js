const MenuModel = (sequelize, DataTypes) => {
    const Menu = sequelize.define(
        "Menu",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(150),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "Name cannot be empty" },
                },
            },
            has_child: {
                type: DataTypes.BOOLEAN,
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
            tableName: "menu",
            timestamps: true,
        }
    );

    Menu.associate = (models) => {
        Menu.hasMany(models.Submenu, {
            foreignKey: "menu_id",
        });
    };

    return Menu;
};

export default MenuModel;
