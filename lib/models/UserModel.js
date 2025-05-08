import bcrypt from "bcryptjs";
const saltRounds = 10;

const UserModel = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    async isValidRole(value) {
                        const Role = sequelize.models.Role; // Get Role model from sequelize
                        if (!Role) {
                            throw new Error("Role model is not available.");
                        }
                        const role = await Role.findByPk(value);
                        if (!role) {
                            throw new Error("Role field is required.");
                        }
                    },
                },
            },
            photo_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    async isValidFile(value) {
                        const File = sequelize.models.File; // Get Role model from sequelize
                        if (!File) {
                            throw new Error("File model is not available.");
                        }
                        if (value) {
                            const file = await File.findByPk(value);
                            if (!file) {
                                throw new Error("Invalid file ID.");
                            }
                        }
                    },
                },
            },
            provider: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue: "credentials",
            },
            first_name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                set(value) {
                    const formatted = value
                        .toLowerCase()
                        .split(" ")
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ");

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
                    const formatted = value
                        .toLowerCase()
                        .split(" ")
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ");

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
                type: DataTypes.ENUM("male", "female", "unknown"),
                allowNull: false,
                defaultValue: "unknown",
                validate: {
                    isIn: {
                        args: [["male", "female", "unknown"]],
                        msg: "Invalid gender type.",
                    },
                },
            },
            is_active: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 1,
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
            full_name: {
                type: DataTypes.VIRTUAL,
                get() {
                    return `${this.first_name} ${this.last_name}`;
                },
            },
        },
        { timestamps: true, tableName: "users" }
    );

    User.prototype.validPassword = async function (password) {
        const currentPass = this.password;
        // const isValid = await bcrypt.compare(password, currentPass);
        return await bcrypt.compare(password, currentPass);
    };

    // Define associations in the `associate` method
    User.associate = (models) => {
        User.belongsTo(models.Role, {
            foreignKey: "role_id",
            onDelete: "RESTRICT",
        });
        User.belongsTo(models.File, {
            foreignKey: "photo_id",
            onDelete: "SET NULL",
        });
    };

    return User;
};

export default UserModel;
