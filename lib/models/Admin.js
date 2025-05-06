import bcrypt from "bcryptjs";
const saltRounds = 10;

const AdminModel = (sequelize, DataTypes) => {
    const Admin = sequelize.define(
        "Admin",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
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

                    this.setDataValue("last_name", formatted);
                },
                validate: {
                    notEmpty: {
                        msg: "Last Name field is required.",
                    },
                    is: {
                        args: /^[A-Za-z\s]+$/, // Allows only letters and spaces
                        msg: "Last Name can only contain letters and spaces.",
                    },
                },
            },
            full_name: {
                type: DataTypes.VIRTUAL,
                get() {
                    return `${this.first_name} ${this.last_name}`;
                },
            },
            photo_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    async isValidFile(value) {
                        const File = sequelize.models.File;
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
            // image: {
            //     type: DataTypes.STRING(250),
            //     allowNull: true, // Optional: for Auth.js compatibility (user profile image URL)
            // },
            gender: {
                type: DataTypes.ENUM("male", "female", "unknown"),
                allowNull: false,
                defaultValue: "male",
                validate: {
                    notEmpty: {
                        msg: "Gender field is required.",
                    },
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
                    notEmpty: {
                        msg: "Email field is required.",
                    },
                    isEmail: {
                        msg: "Email field must be a valid email.",
                    },
                },
            },
            // emailVerified: {
            //     type: DataTypes.DATE,
            //     allowNull: true, // Optional: for Auth.js (email verification timestamp)
            // },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
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
        },
        { timestamps: true, tableName: "admins" }
    );

    Admin.prototype.validPassword = async function (password) {
        const currentPass = this.password;
        // const isValid = await bcrypt.compare(password, currentPass);
        return await bcrypt.compare(password, currentPass);
    };

    /* Define associations in the `associate` method
     */
    Admin.associate = (models) => {
        // Admin.belongsTo(models.Role, {
        //     foreignKey: "role_id",
        //     onDelete: "RESTRICT",
        // });
        Admin.belongsTo(models.File, {
            foreignKey: "photo_id",
            onDelete: "SET NULL",
        });
    };

    return Admin;
};

export default AdminModel;
