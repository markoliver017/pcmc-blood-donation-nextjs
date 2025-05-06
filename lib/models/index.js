import { DataTypes } from "sequelize";
import sequelize from "../db.js";

import RoleModel from "./RoleModel.js";
import UserModel from "./UserModel.js";
import BloodTypeModel from "./BloodTypeModel.js";
import FileModel from "./FileModel.js";
import MenuModel from "./MenuModel.js";
import SubMenuModel from "./SubMenuModel.js";

// Import models
const User = UserModel(sequelize, DataTypes);
const Role = RoleModel(sequelize, DataTypes);
const BloodType = BloodTypeModel(sequelize, DataTypes);
const File = FileModel(sequelize, DataTypes);
const Menu = MenuModel(sequelize, DataTypes);
const SubMenu = SubMenuModel(sequelize, DataTypes);

const models = {
    User,
    Role,
    BloodType,
    File,
    Menu,
    Submenu,
    Agency,
    AgencyCoordinator,
    Donor,
    BloodDonationEvent,
    BookingSchedule,
    DonorAppointmentInfo,
    BloodRequest,
    AuditTrail,
    Notification,
    EmailNotification,
};

// Set up associations by calling associate methods
Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});

// Export models and sequelize instance
export {
    sequelize,
    Admin,
    Report,
    ErrorType,
    GenericMedicine,
    RouteMedicine,
    ReportMedicineRoute,
    ReportRequest,
    File,
};
