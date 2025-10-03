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
import PhysicalExaminationModel from "./PhysicalExaminationModel.js";
import ScreeningDetailModel from "./ScreeningDetailModel.js";
import ScreeningQuestionModel from "./ScreeningQuestionModel.js";
import BloodDonationCollectionModel from "./BloodDonationCollectionModel.js";
import BloodDonationHistoryModel from "./BloodDonationHistoryModel.js";
import EmailTemplateModel from "./EmailTemplateModel.js";
import AnnouncementModel from "./AnnouncementModel.js";
import ContactFormModel from "./ContactFormModel.js";
import PasswordResetModel from "./PasswordResetModel.js";
import FeedbackQuestionModel from "./FeedbackQuestionModel.js";
import FeedbackResponseModel from "./FeedbackResponseModel.js";
import FaqModel from "./FaqModel.js";

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
const PhysicalExamination = PhysicalExaminationModel(sequelize, DataTypes);
const ScreeningDetail = ScreeningDetailModel(sequelize, DataTypes);
const ScreeningQuestion = ScreeningQuestionModel(sequelize, DataTypes);
const BloodDonationCollection = BloodDonationCollectionModel(
    sequelize,
    DataTypes
);
const BloodDonationHistory = BloodDonationHistoryModel(sequelize, DataTypes);
const EmailTemplate = EmailTemplateModel(sequelize, DataTypes);
const Announcement = AnnouncementModel(sequelize, DataTypes);
const ContactForm = ContactFormModel(sequelize, DataTypes);
const PasswordReset = PasswordResetModel(sequelize, DataTypes);
const FeedbackQuestion = FeedbackQuestionModel(sequelize, DataTypes);
const FeedbackResponse = FeedbackResponseModel(sequelize, DataTypes);
const Faq = FaqModel(sequelize, DataTypes);

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
    PhysicalExamination,
    ScreeningDetail,
    ScreeningQuestion,
    BloodDonationCollection,
    BloodDonationHistory,
    EmailTemplate,
    Announcement,
    ContactForm,
    PasswordReset,
    FeedbackQuestion,
    FeedbackResponse,
    Faq,
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
    PhysicalExamination,
    ScreeningDetail,
    ScreeningQuestion,
    BloodDonationCollection,
    BloodDonationHistory,
    EmailTemplate,
    Announcement,
    ContactForm,
    PasswordReset,
    FeedbackQuestion,
    FeedbackResponse,
    Faq,
};
