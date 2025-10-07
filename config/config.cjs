// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const dotenv = require("dotenv");
// 1. Determine the environment (Sequelize CLI defaults to 'development')
// The CLI will automatically match the section name ('development' or 'production')
const NODE_ENV = process.env.NODE_ENV || "development";
// 2. Construct the path to the correct .env file
// This ensures it loads .env.development or .env.production
const envPath = path.resolve(__dirname, `../.env.${NODE_ENV}`);
dotenv.config({ path: envPath });

console.log("envPath", envPath);

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "mysql",
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "mysql",
    },
};
