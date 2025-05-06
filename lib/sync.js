import { sequelize } from "./models/index.js";

// process.on("SIGINT", async () => {
//     try {
//         await sequelize.close();
//         console.log("✅ Database connection closed gracefully.");
//         process.exit(0);
//     } catch (error) {
//         console.error("❌ Error closing database connection:", error);
//         process.exit(1);
//     }
// });

const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true }); // Sync models
        console.log("✅ Tables synchronized successfully.");
    } catch (error) {
        console.error("❌ Database sync failed:", error);
    }
};
syncDatabase();
