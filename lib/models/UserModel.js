import { Sequelize } from "sequelize";
import { formatPersonName } from "../utils/string.utils.js";
import bcrypt from "bcryptjs";
const saltRounds = 10;

const generateFullName = (user) => {
    if (user.first_name && user.last_name) {
        user.name = `${user.first_name} ${user.last_name}`;
    }
};

const UserModel = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "user",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING(250),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: {
                        msg: "Email field must be a valid email.",
                    },
                },
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email_verified: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: bcrypt.hashSync("pedbcmbdpassword", 10),
                validate: {
                    len: {
                        args: [8, 255],
                        msg: "Password must be atleast 8 characters long.",
                    },
                    notEmpty: {
                        msg: "Password field is required.",
                    },
                },
                set(value) {
                    if (value.length >= 8) {
                        const hashedPassword = bcrypt.hashSync(
                            value,
                            saltRounds
                        );
                        this.setDataValue("password", hashedPassword);
                    } else {
                        this.setDataValue("password", value);
                    }
                },
            },

            // role_id: {
            //     type: DataTypes.INTEGER,
            //     allowNull: true,
            //     validate: {
            //         async isValidRole(value) {
            //             if (value == null) return;

            //             const Role = sequelize.models.Role; // Get Role model from sequelize
            //             if (!Role) {
            //                 throw new Error("Role model is not available.");
            //             }
            //             const role = await Role.findByPk(value);
            //             if (!role) {
            //                 throw new Error("Role field is required.");
            //             }
            //         },
            //     },
            // },
            first_name: {
                type: DataTypes.STRING(50),
                allowNull: true,
                set(value) {
                    const formatted = formatPersonName(value);
                    this.setDataValue("first_name", formatted);
                },
                validate: {
                    notEmpty: {
                        msg: "First Name field is required.",
                    },
                    is: {
                        args: /^[A-Za-z\s]+$/, // Allows only letters and spaces
                        msg: "First Name can only contain letters and spaces.",
                    },
                },
            },
            last_name: {
                type: DataTypes.STRING(50),
                allowNull: true,
                set(value) {
                    const formatted = formatPersonName(value);

                    this.setDataValue("last_name", formatted);
                },
                validate: {
                    // notEmpty: {
                    //     msg: "Last Name field is required.",
                    // },
                    is: {
                        args: /^[A-Za-z\s]+$/, // Allows only letters and spaces
                        msg: "Last Name can only contain letters and spaces.",
                    },
                },
            },
            middle_name: {
                type: DataTypes.STRING(50),
                allowNull: true,
                validate: {
                    isValid(value) {
                        if (value && !/^[A-Za-z\s]+$/.test(value)) {
                            throw new Error(
                                "Middle Name can only contain letters and spaces."
                            );
                        }
                    },
                },
            },
            prefix: { type: DataTypes.STRING(50), allowNull: true },
            suffix: { type: DataTypes.STRING(50), allowNull: true },
            gender: {
                type: DataTypes.ENUM("male", "female"),
                allowNull: true,
                defaultValue: "male",
                validate: {
                    isIn: {
                        args: [["male", "female"]],
                        msg: "Invalid sex type.",
                    },
                },
            },
            is_active: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 1,
            },
            full_name: {
                type: DataTypes.VIRTUAL,
                get() {
                    return `${this.first_name} ${this.last_name}`;
                },
            },
            updated_by: {
                type: DataTypes.UUID,
                allowNull: true,
                validate: {
                    async isValidUser(value) {
                        const User = sequelize.models.user;
                        if (!User) {
                            throw new Error("User model is not available.");
                        }
                        if (value) {
                            const user = await User.findByPk(value);
                            if (!user) {
                                throw new Error("Invalid User ID.");
                            }
                        }
                    },
                },
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
        },
        {
            hooks: {
                beforeCreate: generateFullName,
                beforeUpdate: generateFullName,
            },
            timestamps: false,
            tableName: "users",
        }
    );

    User.prototype.validPassword = async function (password) {
        const currentPass = this.password;
        // const isValid = await bcrypt.compare(password, currentPass);
        return await bcrypt.compare(password, currentPass);
    };

    // Define associations in the `associate` method
    User.associate = (models) => {
        User.belongsToMany(models.Role, {
            through: models.UserRole,
            foreignKey: "user_id",
            otherKey: "role_id",
            as: "roles",
            onDelete: "CASCADE",
        });

        User.belongsTo(models.User, {
            foreignKey: "updated_by",
            onDelete: "SET NULL",
            as: "creator",
        });

        User.hasOne(models.Agency, {
            foreignKey: "head_id",
            as: "headedAgency",
        });

        // User.hasMany(models.UserRole, {
        //     foreignKey: "role_id",
        //     as: "roles",
        //     onDelete: "CASCADE",
        // });
    };

    return User;
};

export default UserModel;
