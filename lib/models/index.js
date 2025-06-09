import { DataTypes } from "sequelize";
import sequelize from "../db.js";

// Initialize Sequelize adapter
import SequelizeAdapter from "@auth/sequelize-adapter";

import UserModel from "./UserModel.js";
import RoleModel from "./RoleModel.js";
import UserRoleModel from "./UserRoleModel.js";
import BloodTypeModel from "./BloodTypeModel.js";
// import FileModel from "./FileModel.js";
import MenuModel from "./MenuModel.js";
import SubMenuModel from "./SubMenuModel.js";
import AgencyModel from "./AgencyModel.js";
import AgencyCoordinatorModel from "./AgencyCoordinatorModel.js";
import DonorModel from "./DonorModel.js";
import BloodDonationEventModel from "./BloodDonationEventModel.js";
import EventTimeScheduleModel from "./EventTimeScheduleModel.js";
import DonorAppointmentInfoModel from "./DonorAppointmentInfoModel.js";
import BloodRequestModel from "./BloodRequestModel.js";
import AuditTrailModel from "./AuditTrailModel.js";
import NotificationModel from "./NotificationModel.js";
import EmailNotificationModel from "./EmailNotificationModel.js";

const adapter = SequelizeAdapter(sequelize);
// Import models
const User = UserModel(sequelize, DataTypes);
const Role = RoleModel(sequelize, DataTypes);
const UserRole = UserRoleModel(sequelize, DataTypes);
const BloodType = BloodTypeModel(sequelize, DataTypes);
// const File = FileModel(sequelize, DataTypes);
const Menu = MenuModel(sequelize, DataTypes);
const SubMenu = SubMenuModel(sequelize, DataTypes);
const Agency = AgencyModel(sequelize, DataTypes);
const AgencyCoordinator = AgencyCoordinatorModel(sequelize, DataTypes);
const Donor = DonorModel(sequelize, DataTypes);
const BloodDonationEvent = BloodDonationEventModel(sequelize, DataTypes);
const EventTimeSchedule = EventTimeScheduleModel(sequelize, DataTypes);
const DonorAppointmentInfo = DonorAppointmentInfoModel(sequelize, DataTypes);
const BloodRequest = BloodRequestModel(sequelize, DataTypes);
const AuditTrail = AuditTrailModel(sequelize, DataTypes);
const Notification = NotificationModel(sequelize, DataTypes);
const EmailNotification = EmailNotificationModel(sequelize, DataTypes);

const models = {
    User,
    Role,
    UserRole,
    BloodType,
    // File,
    Menu,
    SubMenu,
    Agency,
    AgencyCoordinator,
    Donor,
    BloodDonationEvent,
    EventTimeSchedule,
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

// console.log("sequelize models>>>", sequelize.models)

// Export models and sequelize instance
export {
    sequelize,
    adapter,
    User,
    Role,
    UserRole,
    BloodType,
    // File,
    Menu,
    SubMenu,
    Agency,
    AgencyCoordinator,
    Donor,
    BloodDonationEvent,
    EventTimeSchedule,
    DonorAppointmentInfo,
    BloodRequest,
    AuditTrail,
    Notification,
    EmailNotification,
};
