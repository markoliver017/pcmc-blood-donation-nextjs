import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

// const sequelize = new Sequelize(
//     process.env.DB_NAME || "PedDbase07152025", //database
//     process.env.DB_USER, //username
//     process.env.DB_PASSWORD || "PdstyKznUIGG0%j", //password
//     {
//         host: process.env.DB_HOST,
//         dialect: "mysql", // Use 'mysql' for MySQL databases
//         dialectModule: mysql2,
//         benchmark: true,
//         logging: false, // Disable SQL query logging in console
//         // logging: (...msg) => console.log(msg),
//     }
// );
export const getSequelizeInstance = () => {
    // Note: Removed the unsafe hardcoded defaults!
    // If process.env.DB_NAME is undefined, the app will crash, which is good.
    if (!process.env.DB_HOST || !process.env.DB_USER) {
        throw new Error(
            "❌ Fatal Error: DB_HOST or DB_USER is not set in environment."
        );
    }

    const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: "mysql",
            dialectModule: mysql2,
            benchmark: true,
            logging:
                process.env.NODE_ENV === "development" ? console.log : false,
        }
    );

    return sequelize;
};

// export default sequelize;
