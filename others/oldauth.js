// import NextAuth from "next-auth";
// import SequelizeAdapter, { models } from "@auth/sequelize-adapter";
// import Sequelize, { DataTypes } from "sequelize";
// import mysql2 from "mysql2";

// const sequelize = new Sequelize(
//     "inmers", // database
//     "root", // username
//     process.env.DB_PASSWORD, // password
//     {
//         host: "localhost",
//         dialect: "mysql",
//         dialectModule: mysql2,
//         benchmark: true,
//         logging: false,
//     }
// );

// export const { handlers, auth, signIn, signOut } = NextAuth({
//     providers: [],
//     adapter: SequelizeAdapter(sequelize, {
//         models: {
//             User: (() => {
//                 const User = sequelize.define(
//                     "user",
//                     {
//                         ...models.User,
//                         first_name: {
//                             type: DataTypes.STRING(50),
//                             allowNull: false,
//                             set(value) {
//                                 const formatted = value
//                                     .toLowerCase()
//                                     .split(" ")
//                                     .map(
//                                         (word) =>
//                                             word.charAt(0).toUpperCase() +
//                                             word.slice(1)
//                                     )
//                                     .join(" ");
//                                 this.setDataValue("first_name", formatted);
//                             },
//                             validate: {
//                                 notEmpty: {
//                                     msg: "First Name field is required.",
//                                 },
//                                 is: {
//                                     args: /^[A-Za-z\s]+$/,
//                                     msg: "First Name can only contain letters and spaces.",
//                                 },
//                             },
//                         },
//                         last_name: {
//                             type: DataTypes.STRING(50),
//                             allowNull: false,
//                             set(value) {
//                                 const formatted = value
//                                     .toLowerCase()
//                                     .split(" ")
//                                     .map(
//                                         (word) =>
//                                             word.charAt(0).toUpperCase() +
//                                             word.slice(1)
//                                     )
//                                     .join(" ");
//                                 this.setDataValue("last_name", formatted);
//                             },
//                             validate: {
//                                 notEmpty: {
//                                     msg: "Last Name field is required.",
//                                 },
//                                 is: {
//                                     args: /^[A-Za-z\s]+$/,
//                                     msg: "Last Name can only contain letters and spaces.",
//                                 },
//                             },
//                         },
//                         full_name: {
//                             type: DataTypes.VIRTUAL,
//                             get() {
//                                 return `${this.first_name} ${this.last_name}`;
//                             },
//                         },
//                         photo_id: {
//                             type: DataTypes.INTEGER,
//                             allowNull: true,
//                             validate: {
//                                 async isValidFile(value) {
//                                     const File = sequelize.models.File;
//                                     if (!File)
//                                         throw new Error(
//                                             "File model is not available."
//                                         );
//                                     if (value) {
//                                         const file = await File.findByPk(value);
//                                         if (!file)
//                                             throw new Error("Invalid file ID.");
//                                     }
//                                 },
//                             },
//                         },
//                         image: {
//                             type: DataTypes.STRING(250),
//                             allowNull: true,
//                         },
//                         gender: {
//                             type: DataTypes.ENUM("male", "female", "unknown"),
//                             allowNull: false,
//                             defaultValue: "male",
//                             validate: {
//                                 notEmpty: { msg: "Gender field is required." },
//                                 isIn: {
//                                     args: [["male", "female", "unknown"]],
//                                     msg: "Invalid gender type.",
//                                 },
//                             },
//                         },
//                         is_active: {
//                             type: DataTypes.TINYINT,
//                             allowNull: false,
//                             defaultValue: 1,
//                         },
//                         email: {
//                             type: DataTypes.STRING(250),
//                             allowNull: false,
//                             unique: true,
//                             validate: {
//                                 notEmpty: { msg: "Email field is required." },
//                                 isEmail: {
//                                     msg: "Email field must be a valid email.",
//                                 },
//                             },
//                         },
//                         emailVerified: {
//                             type: DataTypes.DATE,
//                             allowNull: true,
//                         },
//                         password: {
//                             type: DataTypes.STRING,
//                             allowNull: false,
//                             validate: {
//                                 len: {
//                                     args: [8, 255],
//                                     msg: "Password must be atleast 8 characters long.",
//                                 },
//                                 notEmpty: {
//                                     msg: "Password field is required.",
//                                 },
//                             },
//                             set(value) {
//                                 if (value.length >= 8) {
//                                     const hashedPassword = bcrypt.hashSync(
//                                         value,
//                                         saltRounds
//                                     );
//                                     this.setDataValue(
//                                         "password",
//                                         hashedPassword
//                                     );
//                                 } else {
//                                     this.setDataValue("password", value);
//                                 }
//                             },
//                         },
//                     },
//                     {
//                         timestamps: true,
//                         tableName: "admins",
//                         hooks: {},
//                     }
//                 );

//                 // Prototype method
//                 User.prototype.validPassword = function (plainPassword) {
//                     return bcrypt.compareSync(plainPassword, this.password);
//                 };

//                 // Association
//                 User.associate = (models) => {
//                     User.belongsTo(models.File, {
//                         foreignKey: "photo_id",
//                         as: "photo",
//                         onDelete: "SET NULL",
//                     });
//                 };

//                 return User;
//             })(),
//             Report: (() => {
//                 const Report = sequelize.define(
//                     "report",
//                     {
//                         id: {
//                             type: DataTypes.INTEGER,
//                             autoIncrement: true,
//                             primaryKey: true,
//                         },
//                         report_date: {
//                             type: DataTypes.DATEONLY,
//                             allowNull: false,
//                             validate: {
//                                 notEmpty: {
//                                     msg: "Report Date is required.",
//                                 },
//                                 isDate: {
//                                     msg: "Report Date must be a valid date.",
//                                 },
//                             },
//                         },
//                         error_date: {
//                             type: DataTypes.DATEONLY,
//                             allowNull: false,
//                             validate: {
//                                 notEmpty: {
//                                     msg: "Medication Error Date field is required.",
//                                 },
//                                 isDate: {
//                                     msg: "Medication Error Date field must be a valid date.",
//                                 },
//                             },
//                         },
//                         patient_sex: {
//                             type: DataTypes.ENUM("male", "female", "unknown"),
//                             allowNull: false,
//                             validate: {
//                                 isIn: {
//                                     args: [["male", "female", "unknown"]],
//                                     msg: "Patient Sex must be either Male, Female or unknown.",
//                                 },
//                                 notEmpty: {
//                                     msg: "Patient Sex is required.",
//                                 },
//                             },
//                         },
//                         patient_weight: {
//                             type: DataTypes.DECIMAL(5, 2),
//                             allowNull: false,
//                             validate: {
//                                 isDecimal: {
//                                     msg: "Patient Weight must be a decimal value.",
//                                 },
//                                 min: {
//                                     args: [0],
//                                     msg: "Patient Weight must be a positive value.",
//                                 },
//                                 notEmpty: {
//                                     msg: "Patient Weight is required.",
//                                 },
//                             },
//                         },
//                         patient_height: {
//                             type: DataTypes.DECIMAL(5, 2),
//                             allowNull: false,
//                             validate: {
//                                 isDecimal: {
//                                     msg: "Patient Height must be a decimal value.",
//                                 },
//                                 min: {
//                                     args: [0],
//                                     msg: "Patient Height must be a positive value.",
//                                 },
//                                 notEmpty: {
//                                     msg: "Patient Height is required.",
//                                 },
//                             },
//                         },
//                         exact_prescription: {
//                             type: DataTypes.TEXT,
//                             allowNull: false,
//                             validate: {
//                                 notEmpty: {
//                                     msg: "Exact Prescription is required.",
//                                 },
//                             },
//                         },
//                         error_type_id: {
//                             type: DataTypes.INTEGER,
//                             allowNull: false,
//                             validate: {
//                                 async isValidErrorType(value) {
//                                     const Type = sequelize.models.ErrorType; // Get Role model from sequelize
//                                     if (!Type) {
//                                         throw new Error(
//                                             "Error type model is not available."
//                                         );
//                                     }
//                                     const type = await Type.findByPk(value);
//                                     if (!type) {
//                                         throw new Error(
//                                             "Error type field is required."
//                                         );
//                                     }
//                                 },
//                             },
//                         },

//                         other_error_type: {
//                             type: DataTypes.TEXT,
//                             validate: {
//                                 isRequiredIfOthers(value) {
//                                     if (this.error_type === "12" && !value) {
//                                         throw new Error(
//                                             "Please specify the type of error when selecting 'Others' as the error type."
//                                         );
//                                     }
//                                 },
//                             },
//                         },
//                         incident_description: {
//                             type: DataTypes.TEXT,
//                             allowNull: false,
//                             validate: {
//                                 notEmpty: {
//                                     msg: "Description of the medication error incident is required.",
//                                 },
//                             },
//                         },
//                         workplace_environment: {
//                             type: DataTypes.TEXT,
//                             allowNull: false,
//                             validate: {
//                                 notEmpty: {
//                                     msg: "Description of the workplace environment is required.",
//                                 },
//                             },
//                         },
//                         patient_condition: {
//                             type: DataTypes.TEXT,
//                             allowNull: false,
//                             validate: {
//                                 notEmpty: {
//                                     msg: "Description of the patient condition is required.",
//                                 },
//                             },
//                         },
//                         immediate_actions: {
//                             type: DataTypes.TEXT,
//                             allowNull: false,
//                             validate: {
//                                 notEmpty: {
//                                     msg: "Description of the immediate action/s done is required.",
//                                 },
//                             },
//                         },
//                         corrective_actions: {
//                             type: DataTypes.TEXT,
//                             allowNull: false,
//                             validate: {
//                                 notEmpty: {
//                                     msg: "Description of the corrective action/s done is required.",
//                                 },
//                             },
//                         },
//                         preventive_actions: {
//                             type: DataTypes.TEXT,
//                             allowNull: false,
//                             validate: {
//                                 notEmpty: {
//                                     msg: "Description of the preventive action/s done is required.",
//                                 },
//                             },
//                         },
//                         is_verified: {
//                             type: DataTypes.BOOLEAN,
//                             defaultValue: false,
//                             // validate: {
//                             //     isVerified(value) {
//                             //         if (!value || value == 0 || value == false) {
//                             //             throw new Error(
//                             //                 "Please review and verify the details of the medication error incident."
//                             //             );
//                             //         }
//                             //     },
//                             // },
//                         },
//                     },
//                     { timestamps: true, tableName: "reports" }
//                 );
//                 // Association
//                 Report.associate = (models) => {
//                     Report.belongsTo(models.ErrorType, {
//                         foreignKey: "error_type_id",
//                         as: "error_type",
//                         onDelete: "RESTRICT",
//                     });
//                 };

//                 return Report;
//             })(),
//             ErrorType: (() => {
//                 const ErrorType = sequelize.define(
//                     "ErrorType",
//                     {
//                         id: {
//                             type: DataTypes.INTEGER,
//                             autoIncrement: true,
//                             primaryKey: true,
//                         },
//                         name: {
//                             type: DataTypes.STRING(255),
//                             allowNull: false,
//                             validate: {
//                                 notEmpty: {
//                                     msg: "Medication error name is required.",
//                                 },
//                             },
//                         },
//                         is_active: {
//                             type: DataTypes.BOOLEAN,
//                             defaultValue: true,
//                         },
//                     },
//                     { timestamps: true, tableName: "error_types" }
//                 );
//                 // Association
//                 ErrorType.associate = (models) => {
//                     ErrorType.hasMany(models.Report, {
//                         foreignKey: "error_type_id",
//                     });
//                 };

//                 return ErrorType;
//             })(),
//             File: (() => {
//                 const File = sequelize.define(
//                     "File",
//                     {
//                         id: {
//                             type: DataTypes.INTEGER,
//                             autoIncrement: true,
//                             primaryKey: true,
//                         },
//                         url: { type: DataTypes.TEXT, allowNull: false },
//                         table_name: {
//                             type: DataTypes.STRING(255),
//                             allowNull: false,
//                         },
//                         type: {
//                             type: DataTypes.ENUM("online", "file_upload"),
//                             allowNull: false,
//                         },
//                     },
//                     { timestamps: true, tableName: "files" }
//                 );
//                 // Association
//                 // File.associate = (models) => {
//                 //     ErrorType.hasMany(models.Report, {
//                 //         foreignKey: "error_type_id",
//                 //     });
//                 // };

//                 return File;
//             })(),
//         },
//     }),
// });
