import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import mysql2 from "mysql2";
dotenv.config({ path: ".env.development" });

const sequelize = new Sequelize(
    process.env.DB_NAME || "PedDbase07152025", //database
    process.env.DB_USER || "mroman", //username
    process.env.DB_PASSWORD || "PdstyKznUIGG0%j", //password
    {
        host: process.env.DB_HOST,
        dialect: "mysql", // Use 'mysql' for MySQL databases
        dialectModule: mysql2,
        benchmark: true,
        logging: false, // Disable SQL query logging in console
        // logging: (...msg) => console.log(msg),
    }
);

(async () => {
    try {
        await sequelize.authenticate(); // Check DB connection
        console.log("✅ Database connected successfully.");
        console.log("✅ Running in:.", process.env.NODE_ENV);
        console.log("✅ DB Name:.", process.env.DB_NAME);

        // await sequelize.sync({ alter: true });
    } catch (error) {
        console.error("❌ Database authentication failed:", error);
        console.log("✅ Running in:.", process.env.NODE_ENV);
    }
})();

export default sequelize;
