// lib/sync.js (Revised to be a standalone runner)

import dotenv from "dotenv";
import path from "path";
import { getSequelizeInstance } from "./db.js";

// 1. Configure the environment variables for this script
// This ensures NODE_ENV is respected, even when running the sync directly.
const NODE_ENV = process.env.NODE_ENV || "development";
const envPath = path.resolve(process.cwd(), `.env.${NODE_ENV}`);
dotenv.config({ path: envPath });

// 2. Define the sync function
const syncDatabase = async (sequelizeInstance) => {
    try {
        await sequelizeInstance.authenticate(); // Check connection first
        console.log(`✅ Database connected successfully in ${NODE_ENV} mode.`);

        await sequelizeInstance.sync({ alter: true }); // Sync models
        console.log("✅ Tables synchronized successfully.");
    } catch (error) {
        console.error("❌ Database sync failed:", error.message);
        console.error(
            `❌ Check your .env.${NODE_ENV} file and database connection details.`
        );
        process.exit(1); // Exit with an error code if sync fails
    }
};

// 3. Execute the sync logic
(async () => {
    try {
        // Create the sequelize instance AFTER loading environment variables
        const sequelize = getSequelizeInstance();
        await syncDatabase(sequelize);
    } catch (error) {
        // Catch errors from getSequelizeInstance (e.g., missing env vars)
        console.error("❌ Startup Error:", error.message);
        process.exit(1);
    }
})();
