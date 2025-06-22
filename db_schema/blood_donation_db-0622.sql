-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: blood_donation_db
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--
--

DROP TABLE IF EXISTS `agencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agencies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `head_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `file_url` text,
  `name` varchar(255) NOT NULL,
  `contact_number` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `city_municipality` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL DEFAULT 'Metro Manila',
  `region` varchar(255) NOT NULL DEFAULT 'luzon',
  `comments` text,
  `remarks` varchar(255) DEFAULT NULL,
  `status` enum('for approval','rejected','activated','deactivated') NOT NULL DEFAULT 'for approval',
  `verified_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `organization_type` enum('business','media','government','church','education','healthcare') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `agencies_name_unique` (`name`),
  KEY `head_id` (`head_id`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `agencies_ibfk_1` FOREIGN KEY (`head_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `agencies_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agencies`
--

LOCK TABLES `agencies` WRITE;
/*!40000 ALTER TABLE `agencies` DISABLE KEYS */;
INSERT INTO `agencies` VALUES (11,'20c5c4fa-c040-473c-9236-0192efed2643',NULL,'Runte - Reilly','+639663603172','4257 Kassulke Spring','Bagong Silang','City of Mandaluyong','Metro Manila','luzon',NULL,NULL,'activated','20c5c4fa-c040-473c-9236-0192efed2643','20c5c4fa-c040-473c-9236-0192efed2643','business','2025-06-04 12:58:14','2025-06-04 13:00:57'),(12,'76a2608b-524e-43b3-9b38-44cb9b6a6ac5',NULL,'Cummerata - Kunde','831.455.5962 x5774','231 The Orchard','Tyrese Branch','North Hettieboro','Metro Manila','luzon',NULL,NULL,'for approval',NULL,NULL,'business','2025-06-04 12:58:14','2025-06-04 12:58:14'),(13,'76a2608b-524e-43b3-9b38-44cb9b6a6ac5',NULL,'Brekke, Kub and Wiegand','(296) 674-3114','2580 Travon Field','Rosanna Hollow','Klingberg','Metro Manila','luzon',NULL,NULL,'for approval',NULL,NULL,'media','2025-06-04 12:58:14','2025-06-04 12:58:14'),(14,'d6a96fe5-0560-4c35-9536-734614b89b0e',NULL,'Kris and Sons','735-416-3175 x89416','86115 Miller Spur','Wintheiser Meadows','East Aidenton','Metro Manila','luzon',NULL,NULL,'for approval',NULL,NULL,'government','2025-06-04 12:58:14','2025-06-04 12:58:14'),(15,'d6a96fe5-0560-4c35-9536-734614b89b0e',NULL,'Wyman - Feil','(742) 367-6633 x49162','15117 McKenzie Manors','Georgianna Union','Port Clemensworth','Metro Manila','luzon',NULL,NULL,'for approval',NULL,NULL,'media','2025-06-04 12:58:14','2025-06-04 12:58:14'),(16,'d6a96fe5-0560-4c35-9536-734614b89b0e',NULL,'Schamberger Group','631-431-7323','48251 Mollie Square','Green Terrace','Langberg','Metro Manila','luzon',NULL,NULL,'for approval',NULL,NULL,'healthcare','2025-06-04 12:58:14','2025-06-04 12:58:14'),(17,'d6a96fe5-0560-4c35-9536-734614b89b0e',NULL,'Franey - Leuschke','846.243.0650','62929 Braulio Forest','Bechtelar Port','Koelpinfort','Metro Manila','luzon',NULL,NULL,'for approval',NULL,NULL,'church','2025-06-04 12:58:14','2025-06-04 12:58:14'),(18,'d6a96fe5-0560-4c35-9536-734614b89b0e',NULL,'Zieme LLC','939.430.8416 x98408','577 Kovacek Shores','S Main Avenue','West Patworth','Metro Manila','luzon',NULL,NULL,'for approval',NULL,NULL,'church','2025-06-04 12:58:14','2025-06-04 12:58:14'),(19,'d6a96fe5-0560-4c35-9536-734614b89b0e',NULL,'Klein Inc','(826) 824-9685 x9872','26418 Chestnut Street','W High Street','Milford','Metro Manila','luzon',NULL,NULL,'for approval',NULL,NULL,'church','2025-06-04 12:58:14','2025-06-04 12:58:14'),(20,'d6a96fe5-0560-4c35-9536-734614b89b0e',NULL,'Ondricka - Rath','927.956.4173 x63282','5632 Lawrence Street','Greenholt Extension','Wilhelmineton','Metro Manila','luzon',NULL,NULL,'for approval',NULL,NULL,'education','2025-06-04 12:58:14','2025-06-04 12:58:14'),(21,'6269d821-7644-483d-b64e-52165b5e0132',NULL,'Agency 1','+63999999999','Building 1 address','Amihan','Quezon City','Metro Manila','luzon','My message 1',NULL,'for approval',NULL,NULL,'government','2025-06-15 03:40:22','2025-06-15 03:40:22'),(23,'4f141502-132d-40f8-8fdc-697292d6977b',NULL,'Agency One','+639663603172','Agency 1 Building','Bagong Silang','City of Mandaluyong','Metro Manila','luzon','',NULL,'for approval',NULL,NULL,'business','2025-06-17 14:30:52','2025-06-17 14:30:52'),(25,'0e7d5290-6613-45b6-a2ae-05017569da0b',NULL,'Agency Two','+63966331313','Agency One Building','Bahay Toro','Quezon City','Metro Manila','luzon','I want to be one of your partner agency',NULL,'for approval',NULL,NULL,'government','2025-06-22 09:55:42','2025-06-22 09:55:42');
/*!40000 ALTER TABLE `agencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agency_coordinators`
--

DROP TABLE IF EXISTS `agency_coordinators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agency_coordinators` (
  `id` int NOT NULL AUTO_INCREMENT,
  `agency_id` int NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `contact_number` varchar(255) NOT NULL,
  `comments` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `verified_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status` enum('for approval','activated','deactivated','rejected') NOT NULL DEFAULT 'for approval',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `agency_coordinators_agency_id_user_id_unique` (`agency_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `agency_coordinators_ibfk_37` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `agency_coordinators_ibfk_38` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agency_coordinators`
--

LOCK TABLES `agency_coordinators` WRITE;
/*!40000 ALTER TABLE `agency_coordinators` DISABLE KEYS */;
INSERT INTO `agency_coordinators` VALUES (1,11,'20c5c4fa-c040-473c-9236-0192efed2643','+639663603175','My comments','My remarks','20c5c4fa-c040-473c-9236-0192efed2643','activated','2025-06-04 12:58:14','2025-06-04 15:00:44'),(2,11,'d1b842d1-0a2c-4c77-9c02-e1d71daf849d','+639123456789','',NULL,NULL,'for approval','2025-06-17 14:34:53','2025-06-17 14:34:53');
/*!40000 ALTER TABLE `agency_coordinators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_trails`
--

DROP TABLE IF EXISTS `audit_trails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_trails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `controller` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `is_error` tinyint(1) DEFAULT '0',
  `details` text,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `stack_trace` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `audit_trails_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_trails`
--

LOCK TABLES `audit_trails` WRITE;
/*!40000 ALTER TABLE `audit_trails` DISABLE KEYS */;
INSERT INTO `audit_trails` VALUES (1,'20c5c4fa-c040-473c-9236-0192efed2643','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 11','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-04 12:58:34','2025-06-04 12:58:34'),(2,'20c5c4fa-c040-473c-9236-0192efed2643','agencies','UPDATE',0,'Agency has been successfully updated. ID#: 11','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-04 13:00:57','2025-06-04 13:00:57'),(3,'20c5c4fa-c040-473c-9236-0192efed2643','agencies','UPDATE COORDINATOR STATUS',0,'Coordinator status has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-04 13:04:21','2025-06-04 13:04:21'),(4,'20c5c4fa-c040-473c-9236-0192efed2643','users','updateUserBasicInfo',0,'User has been successfully updated. ID#: 20c5c4fa-c040-473c-9236-0192efed2643','::ffff:127.0.0.1','Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36',NULL,'2025-06-04 14:04:48','2025-06-04 14:04:48'),(5,'20c5c4fa-c040-473c-9236-0192efed2643','agencies','updateCoordinator',0,'The coordinator data has been successfully updated. Coordinator ID#: 1.','::ffff:127.0.0.1','Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36',NULL,'2025-06-04 14:59:54','2025-06-04 14:59:54'),(6,'20c5c4fa-c040-473c-9236-0192efed2643','agencies','updateCoordinator',0,'The coordinator data has been successfully updated. Coordinator ID#: 1.','::ffff:127.0.0.1','Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36',NULL,'2025-06-04 15:00:44','2025-06-04 15:00:44'),(7,'20c5c4fa-c040-473c-9236-0192efed2643','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-10 11:53:21','2025-06-10 11:53:21'),(8,'20c5c4fa-c040-473c-9236-0192efed2643','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-10 11:56:52','2025-06-10 11:56:52'),(9,'20c5c4fa-c040-473c-9236-0192efed2643','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 3','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-10 12:14:24','2025-06-10 12:14:24'),(10,'20c5c4fa-c040-473c-9236-0192efed2643','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-10 14:51:15','2025-06-10 14:51:15'),(11,'20c5c4fa-c040-473c-9236-0192efed2643','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-10 15:09:11','2025-06-10 15:09:11'),(12,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-11 16:00:18','2025-06-11 16:00:18'),(13,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to closed. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:01:48','2025-06-12 03:01:48'),(14,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:01:59','2025-06-12 03:01:59'),(15,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to closed. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:02:47','2025-06-12 03:02:47'),(16,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:10:13','2025-06-12 03:10:13'),(17,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to closed. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:11:21','2025-06-12 03:11:21'),(18,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:12:58','2025-06-12 03:12:58'),(19,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:17:57','2025-06-12 03:17:57'),(20,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to closed. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:19:44','2025-06-12 03:19:44'),(21,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:20:39','2025-06-12 03:20:39'),(22,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to closed. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:23:35','2025-06-12 03:23:35'),(23,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:23:52','2025-06-12 03:23:52'),(24,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to closed. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:25:30','2025-06-12 03:25:30'),(25,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:28:55','2025-06-12 03:28:55'),(26,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to closed. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:29:41','2025-06-12 03:29:41'),(27,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:29:59','2025-06-12 03:29:59'),(28,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to closed. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:31:05','2025-06-12 03:31:05'),(29,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:34:08','2025-06-12 03:34:08'),(30,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to closed. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:34:49','2025-06-12 03:34:49'),(31,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:35:13','2025-06-12 03:35:13'),(32,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to closed. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:35:43','2025-06-12 03:35:43'),(33,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:40:26','2025-06-12 03:40:26'),(34,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to closed. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:48:13','2025-06-12 03:48:13'),(35,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:49:06','2025-06-12 03:49:06'),(36,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to closed. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:53:15','2025-06-12 03:53:15'),(37,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 03:53:41','2025-06-12 03:53:41'),(38,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT STATUS',0,'Event status has been successfully updated. ID#: 2','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-12 04:30:26','2025-06-12 04:30:26'),(39,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT STATUS',0,'Event status has been successfully updated. ID#: 3','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-12 04:42:09','2025-06-12 04:42:09'),(40,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 2','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-12 13:43:50','2025-06-12 13:43:50'),(41,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to closed. ID#: 2','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-12 13:47:44','2025-06-12 13:47:44'),(42,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 2','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-12 13:48:29','2025-06-12 13:48:29'),(43,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to closed. ID#: 2','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-12 13:57:52','2025-06-12 13:57:52'),(44,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 14:07:42','2025-06-12 14:07:42'),(45,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to closed. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 14:07:52','2025-06-12 14:07:52'),(46,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 14:07:59','2025-06-12 14:07:59'),(47,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to closed. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 14:08:05','2025-06-12 14:08:05'),(48,'2008dfe1-f12a-4f93-b457-b8bba552191f','agencies','CREATE',0,'A new donor has been successfully created. Donor ID#: 1 with User account: 2008dfe1-f12a-4f93-b457-b8bba552191f','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-12 14:55:21','2025-06-12 14:55:21'),(49,'20c5c4fa-c040-473c-9236-0192efed2643','donors','UPDATE DONOR STATUS',0,'The Donor status has been successfully updated. ID#: 1','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',NULL,'2025-06-12 15:15:05','2025-06-12 15:15:05'),(50,'6269d821-7644-483d-b64e-52165b5e0132','agencies','CREATE',0,'A new agency has been successfully created. Agency ID#: 21 with User account: 6269d821-7644-483d-b64e-52165b5e0132','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-15 03:40:22','2025-06-15 03:40:22'),(51,'20c5c4fa-c040-473c-9236-0192efed2643','users','CREATE',0,'A new user has been successfully created. ID#: 4b5e18eb-f0f4-4eff-b117-53d19f946356.','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-15 03:50:15','2025-06-15 03:50:15'),(52,'2008dfe1-f12a-4f93-b457-b8bba552191f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 2008dfe1-f12a-4f93-b457-b8bba552191f. ID#: 1','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-15 04:23:29','2025-06-15 04:23:29'),(53,'2008dfe1-f12a-4f93-b457-b8bba552191f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 2008dfe1-f12a-4f93-b457-b8bba552191f. ID#: 2','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-15 04:36:25','2025-06-15 04:36:25'),(54,'2008dfe1-f12a-4f93-b457-b8bba552191f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 2008dfe1-f12a-4f93-b457-b8bba552191f. ID#: 3','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-15 04:37:25','2025-06-15 04:37:25'),(55,'2008dfe1-f12a-4f93-b457-b8bba552191f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 2008dfe1-f12a-4f93-b457-b8bba552191f. ID#: 4','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-15 04:46:46','2025-06-15 04:46:46'),(56,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-15 05:08:06','2025-06-15 05:08:06'),(57,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT STATUS',0,'Event status has been successfully updated. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-15 07:00:57','2025-06-15 07:00:57'),(58,'20c5c4fa-c040-473c-9236-0192efed2643','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 4','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-15 07:04:54','2025-06-15 07:04:54'),(59,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT STATUS',0,'Event status has been successfully updated. ID#: 4','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-15 07:05:39','2025-06-15 07:05:39'),(60,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT STATUS',0,'Event status has been successfully updated. ID#: 4','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-15 07:08:17','2025-06-15 07:08:17'),(61,'20c5c4fa-c040-473c-9236-0192efed2643','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 4','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-15 07:13:37','2025-06-15 07:13:37'),(62,'2008dfe1-f12a-4f93-b457-b8bba552191f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 2008dfe1-f12a-4f93-b457-b8bba552191f. ID#: 5','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-15 07:22:07','2025-06-15 07:22:07'),(63,'20c5c4fa-c040-473c-9236-0192efed2643','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 4','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-15 11:03:51','2025-06-15 11:03:51'),(64,'2008dfe1-f12a-4f93-b457-b8bba552191f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 2008dfe1-f12a-4f93-b457-b8bba552191f. ID#: 6','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-15 11:05:39','2025-06-15 11:05:39'),(65,'acd74134-be0c-42c7-bf37-eb5d6b2f555a','agencies','CREATE',0,'A new donor has been successfully created. Donor ID#: 2 with User account: acd74134-be0c-42c7-bf37-eb5d6b2f555a','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-15 14:06:37','2025-06-15 14:06:37'),(66,'20c5c4fa-c040-473c-9236-0192efed2643','donors','UPDATE DONOR STATUS',0,'The Donor status has been successfully updated. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-15 14:06:48','2025-06-15 14:06:48'),(67,'acd74134-be0c-42c7-bf37-eb5d6b2f555a','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: acd74134-be0c-42c7-bf37-eb5d6b2f555a. ID#: 7','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-15 14:07:37','2025-06-15 14:07:37'),(68,'4f141502-132d-40f8-8fdc-697292d6977b','agencies','CREATE',0,'A new agency has been successfully created. Agency ID#: 23 with User account: 4f141502-132d-40f8-8fdc-697292d6977b','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-17 14:30:52','2025-06-17 14:30:52'),(69,'d1b842d1-0a2c-4c77-9c02-e1d71daf849d','agencies','storeCoordinator',0,'A new coordinator has been successfully created. Coordinator ID#: 2 with User account: d1b842d1-0a2c-4c77-9c02-e1d71daf849d','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-17 14:34:53','2025-06-17 14:34:53'),(70,'20c5c4fa-c040-473c-9236-0192efed2643','donors','UPDATE USERDONOR',0,'The Donor\'s profile has been successfully verified. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-18 14:35:31','2025-06-18 14:35:31'),(71,'20c5c4fa-c040-473c-9236-0192efed2643','donors','UPDATE USERDONOR',0,'The Donor\'s profile has been successfully verified. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-18 14:38:31','2025-06-18 14:38:31'),(72,'2008dfe1-f12a-4f93-b457-b8bba552191f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 2008dfe1-f12a-4f93-b457-b8bba552191f. ID#: 8','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-21 17:03:10','2025-06-21 17:03:10'),(73,'acd74134-be0c-42c7-bf37-eb5d6b2f555a','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: acd74134-be0c-42c7-bf37-eb5d6b2f555a. ID#: 9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-21 17:07:22','2025-06-21 17:07:22'),(74,'acd74134-be0c-42c7-bf37-eb5d6b2f555a','donorAppointmentAction','CANCEL DONOR APPOINTMENT',0,'The donor\'s appointment has been successfully cancelled. ID#: 9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-21 18:50:45','2025-06-21 18:50:45'),(75,'acd74134-be0c-42c7-bf37-eb5d6b2f555a','donorAppointmentAction','CANCEL DONOR APPOINTMENT',0,'The donor\'s appointment has been successfully cancelled. ID#: 9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-21 18:52:55','2025-06-21 18:52:55'),(76,'acd74134-be0c-42c7-bf37-eb5d6b2f555a','donorAppointmentAction','CANCEL DONOR APPOINTMENT',0,'The donor\'s appointment has been successfully cancelled. ID#: 9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-21 18:54:12','2025-06-21 18:54:12'),(77,'acd74134-be0c-42c7-bf37-eb5d6b2f555a','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: acd74134-be0c-42c7-bf37-eb5d6b2f555a. ID#: 10','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-21 18:56:02','2025-06-21 18:56:02'),(78,'acd74134-be0c-42c7-bf37-eb5d6b2f555a','donorAppointmentAction','CANCEL DONOR APPOINTMENT',0,'The donor\'s appointment has been successfully cancelled. ID#: 10','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-21 18:59:49','2025-06-21 18:59:49'),(79,'acd74134-be0c-42c7-bf37-eb5d6b2f555a','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: acd74134-be0c-42c7-bf37-eb5d6b2f555a. ID#: 11','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-21 18:59:58','2025-06-21 18:59:58'),(80,'acd74134-be0c-42c7-bf37-eb5d6b2f555a','donorAppointmentAction','CANCEL DONOR APPOINTMENT',0,'The donor\'s appointment has been successfully cancelled. ID#: 10','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-21 19:10:48','2025-06-21 19:10:48'),(81,'acd74134-be0c-42c7-bf37-eb5d6b2f555a','donorAppointmentAction','CANCEL DONOR APPOINTMENT',0,'The donor\'s appointment has been successfully cancelled. ID#: 10','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-21 19:11:29','2025-06-21 19:11:29'),(82,'acd74134-be0c-42c7-bf37-eb5d6b2f555a','donorAppointmentAction','CANCEL DONOR APPOINTMENT',0,'The donor\'s appointment has been successfully cancelled. ID#: 11','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-21 19:11:42','2025-06-21 19:11:42'),(83,'acd74134-be0c-42c7-bf37-eb5d6b2f555a','donorAppointmentAction','CANCEL DONOR APPOINTMENT',0,'The donor\'s appointment has been successfully cancelled. ID#: 11','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-21 19:12:28','2025-06-21 19:12:28'),(84,'acd74134-be0c-42c7-bf37-eb5d6b2f555a','donorAppointmentAction','CANCEL DONOR APPOINTMENT',0,'The donor\'s appointment has been successfully cancelled. ID#: 9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-21 19:12:54','2025-06-21 19:12:54'),(85,'acd74134-be0c-42c7-bf37-eb5d6b2f555a','donorAppointmentAction','CANCEL DONOR APPOINTMENT',0,'The donor\'s appointment has been successfully cancelled. ID#: 10','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-21 19:13:08','2025-06-21 19:13:08'),(86,'acd74134-be0c-42c7-bf37-eb5d6b2f555a','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: acd74134-be0c-42c7-bf37-eb5d6b2f555a. ID#: 12','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-21 19:42:10','2025-06-21 19:42:10'),(87,'20c5c4fa-c040-473c-9236-0192efed2643','physicalExamAction','storeUpdatePhysicalExam ',0,'The Donor\'s physical examination has been successfully submitted. With appointment ID#: 8.','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-22 07:36:51','2025-06-22 07:36:51'),(88,'20c5c4fa-c040-473c-9236-0192efed2643','physicalExamAction','storeUpdatePhysicalExam ',0,'The Donor\'s physical examination has been successfully submitted. With appointment ID#: 8.','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-22 07:50:34','2025-06-22 07:50:34'),(89,'20c5c4fa-c040-473c-9236-0192efed2643','physicalExamAction','storeUpdatePhysicalExam ',0,'The Donor\'s physical examination has been successfully submitted. With appointment ID#: 8.','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-22 07:51:04','2025-06-22 07:51:04'),(90,'20c5c4fa-c040-473c-9236-0192efed2643','donors','UPDATE DONOR BLOOD TYPE',0,'The Donor\'s blood type has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-22 07:53:34','2025-06-22 07:53:34'),(91,'20c5c4fa-c040-473c-9236-0192efed2643','bloodDonationCollectionAction','storeUpdateBloodCollection ',0,'The Donor\'s blood collection data has been successfully updated. With appointment ID#: 8.','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-22 08:28:24','2025-06-22 08:28:24'),(92,'20c5c4fa-c040-473c-9236-0192efed2643','bloodDonationCollectionAction','storeUpdateBloodCollection ',0,'The Donor\'s blood collection data has been successfully updated. With appointment ID#: 8.','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-22 08:28:49','2025-06-22 08:28:49'),(93,'0e7d5290-6613-45b6-a2ae-05017569da0b','agencies','CREATE',0,'A new agency has been successfully created. Agency ID#: 25 with User account: 0e7d5290-6613-45b6-a2ae-05017569da0b','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-22 09:55:42','2025-06-22 09:55:42');
/*!40000 ALTER TABLE `audit_trails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blood_donation_collections`
--

DROP TABLE IF EXISTS `blood_donation_collections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blood_donation_collections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `donor_id` int NOT NULL,
  `appointment_id` int NOT NULL,
  `event_id` int NOT NULL,
  `physical_examination_id` int NOT NULL,
  `collector_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `volume` decimal(5,2) NOT NULL,
  `remarks` text,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `donor_id` (`donor_id`),
  KEY `appointment_id` (`appointment_id`),
  KEY `event_id` (`event_id`),
  KEY `physical_examination_id` (`physical_examination_id`),
  KEY `collector_id` (`collector_id`),
  CONSTRAINT `blood_donation_collections_ibfk_31` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `blood_donation_collections_ibfk_32` FOREIGN KEY (`appointment_id`) REFERENCES `donor_appointment_infos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `blood_donation_collections_ibfk_33` FOREIGN KEY (`event_id`) REFERENCES `blood_donation_events` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `blood_donation_collections_ibfk_34` FOREIGN KEY (`physical_examination_id`) REFERENCES `physical_examinations` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `blood_donation_collections_ibfk_35` FOREIGN KEY (`collector_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_donation_collections`
--

LOCK TABLES `blood_donation_collections` WRITE;
/*!40000 ALTER TABLE `blood_donation_collections` DISABLE KEYS */;
INSERT INTO `blood_donation_collections` VALUES (1,1,8,1,1,'20c5c4fa-c040-473c-9236-0192efed2643',500.00,'Blood collection update','20c5c4fa-c040-473c-9236-0192efed2643','2025-06-22 08:28:24','2025-06-22 08:28:49');
/*!40000 ALTER TABLE `blood_donation_collections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blood_donation_events`
--

DROP TABLE IF EXISTS `blood_donation_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blood_donation_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `agency_id` int NOT NULL,
  `requester_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `status` enum('approved','for approval','cancelled','rejected') NOT NULL DEFAULT 'for approval',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `verified_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `registration_status` enum('not started','ongoing','closed','completed') NOT NULL DEFAULT 'not started',
  `is_notified` tinyint(1) DEFAULT '0',
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `agency_id` (`agency_id`),
  KEY `requester_id` (`requester_id`),
  KEY `verified_by` (`verified_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `blood_donation_events_ibfk_61` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `blood_donation_events_ibfk_62` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `blood_donation_events_ibfk_63` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `blood_donation_events_ibfk_64` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_donation_events`
--

LOCK TABLES `blood_donation_events` WRITE;
/*!40000 ALTER TABLE `blood_donation_events` DISABLE KEYS */;
INSERT INTO `blood_donation_events` VALUES (1,11,'20c5c4fa-c040-473c-9236-0192efed2643','Sample Title 1','<p><span style=\"font-size: 24px\"><em>This is a sample description</em></span></p>','approved','2025-06-10 11:53:21','2025-06-15 05:08:06',NULL,NULL,NULL,'20c5c4fa-c040-473c-9236-0192efed2643','ongoing',0,'2025-07-01'),(2,11,'20c5c4fa-c040-473c-9236-0192efed2643','Sample Title 2 update','<p><span style=\"font-size: 24px\"><em>This is a sample description update</em></span></p>','approved','2025-06-10 11:56:52','2025-06-15 07:00:56',NULL,NULL,'20c5c4fa-c040-473c-9236-0192efed2643','20c5c4fa-c040-473c-9236-0192efed2643','not started',0,'2025-07-01'),(3,11,'20c5c4fa-c040-473c-9236-0192efed2643','Sample Title 6','<p><span style=\"font-size: 24px\"><em>This is a sample description 6</em></span></p>','rejected','2025-06-10 12:14:24','2025-06-12 04:42:09','Reject title 6',NULL,'20c5c4fa-c040-473c-9236-0192efed2643',NULL,'not started',0,'2025-07-01'),(4,11,'20c5c4fa-c040-473c-9236-0192efed2643','Sample Title 3','<p><span style=\"font-size: 24px\"><em>This is a sample description 3</em></span></p>','approved','2025-06-15 07:04:54','2025-06-15 07:13:37',NULL,NULL,'20c5c4fa-c040-473c-9236-0192efed2643','20c5c4fa-c040-473c-9236-0192efed2643','ongoing',0,'2025-07-02');
/*!40000 ALTER TABLE `blood_donation_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blood_requests`
--

DROP TABLE IF EXISTS `blood_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blood_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `patient_name` varchar(255) NOT NULL,
  `purpose` text,
  `blood_type_id` int NOT NULL,
  `quantity_needed` int NOT NULL,
  `date` date NOT NULL,
  `hospital_name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `zip_code` varchar(10) NOT NULL,
  `country` varchar(50) NOT NULL DEFAULT 'Philippines',
  `status` enum('pending','fulfilled','expired') DEFAULT 'pending',
  `file_url` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `blood_type_id` (`blood_type_id`),
  CONSTRAINT `blood_requests_ibfk_33` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `blood_requests_ibfk_34` FOREIGN KEY (`blood_type_id`) REFERENCES `blood_types` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_requests`
--

LOCK TABLES `blood_requests` WRITE;
/*!40000 ALTER TABLE `blood_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `blood_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blood_types`
--

DROP TABLE IF EXISTS `blood_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blood_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `blood_type` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_types`
--

LOCK TABLES `blood_types` WRITE;
/*!40000 ALTER TABLE `blood_types` DISABLE KEYS */;
INSERT INTO `blood_types` VALUES (1,'A +'),(2,'A -'),(3,'B +'),(4,'B -'),(5,'AB -'),(6,'O +'),(7,'O -');
/*!40000 ALTER TABLE `blood_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donor_appointment_infos`
--

DROP TABLE IF EXISTS `donor_appointment_infos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donor_appointment_infos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `donor_id` int NOT NULL,
  `time_schedule_id` int NOT NULL,
  `donor_type` enum('replacement','volunteer') NOT NULL DEFAULT 'volunteer',
  `patient_name` varchar(255) DEFAULT NULL,
  `relation` varchar(255) DEFAULT NULL,
  `collection_method` enum('whole blood','apheresis') NOT NULL DEFAULT 'whole blood',
  `status` enum('registered','cancelled','no show') NOT NULL DEFAULT 'registered',
  `comments` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `event_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `donor_id` (`donor_id`),
  KEY `time_schedule_id` (`time_schedule_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `donor_appointment_infos_ibfk_18` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `donor_appointment_infos_ibfk_19` FOREIGN KEY (`time_schedule_id`) REFERENCES `event_time_schedules` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `donor_appointment_infos_ibfk_20` FOREIGN KEY (`event_id`) REFERENCES `blood_donation_events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donor_appointment_infos`
--

LOCK TABLES `donor_appointment_infos` WRITE;
/*!40000 ALTER TABLE `donor_appointment_infos` DISABLE KEYS */;
INSERT INTO `donor_appointment_infos` VALUES (8,1,1,'volunteer',NULL,NULL,'whole blood','registered',NULL,'2025-06-21 17:03:09','2025-06-21 17:03:09',NULL,1),(9,2,1,'volunteer',NULL,NULL,'whole blood','cancelled',NULL,'2025-06-21 17:07:22','2025-06-21 18:54:12',NULL,1),(10,2,1,'volunteer',NULL,NULL,'whole blood','cancelled',NULL,'2025-06-21 18:56:02','2025-06-21 19:10:48',NULL,1),(11,2,1,'volunteer',NULL,NULL,'whole blood','cancelled',NULL,'2025-06-21 18:59:58','2025-06-21 19:11:42',NULL,1),(12,2,1,'volunteer',NULL,NULL,'whole blood','registered',NULL,'2025-06-21 19:42:10','2025-06-21 19:42:10',NULL,1);
/*!40000 ALTER TABLE `donor_appointment_infos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donors`
--

DROP TABLE IF EXISTS `donors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `agency_id` int DEFAULT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `blood_type_id` int DEFAULT NULL,
  `date_of_birth` date NOT NULL,
  `address` text NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `city_municipality` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL DEFAULT 'Metro Manila',
  `region` varchar(255) NOT NULL DEFAULT 'luzon',
  `civil_status` enum('single','married','divorced','separated','widowed') NOT NULL DEFAULT 'single',
  `contact_number` varchar(15) NOT NULL,
  `nationality` varchar(255) NOT NULL DEFAULT 'Filipino',
  `occupation` varchar(255) DEFAULT NULL,
  `is_regular_donor` tinyint(1) DEFAULT '0',
  `last_donation_date` varchar(255) DEFAULT NULL,
  `blood_service_facility` varchar(255) DEFAULT NULL,
  `id_url` text,
  `comments` text,
  `status` enum('for approval','activated','deactivated','rejected') NOT NULL DEFAULT 'for approval',
  `verified_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_data_verified` tinyint(1) DEFAULT '0',
  `data_verified_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_bloodtype_verified` tinyint(1) DEFAULT '0',
  `bloodtype_verified_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `agency_id` (`agency_id`),
  KEY `user_id` (`user_id`),
  KEY `blood_type_id` (`blood_type_id`),
  KEY `verified_by` (`verified_by`),
  CONSTRAINT `donors_ibfk_73` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `donors_ibfk_74` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `donors_ibfk_75` FOREIGN KEY (`blood_type_id`) REFERENCES `blood_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `donors_ibfk_76` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donors`
--

LOCK TABLES `donors` WRITE;
/*!40000 ALTER TABLE `donors` DISABLE KEYS */;
INSERT INTO `donors` VALUES (1,11,'2008dfe1-f12a-4f93-b457-b8bba552191f',6,'1993-06-08','#1 Bonifacio Street','Barangay 175','City of Caloocan','Metro Manila','luzon','married','+639663603173','Filipino','Encoder',1,'2022-06-08','Tala',NULL,'Vane Donor Message ','activated','20c5c4fa-c040-473c-9236-0192efed2643',1,NULL,'2025-06-12 14:55:21','2025-06-22 07:53:34','20c5c4fa-c040-473c-9236-0192efed2643',1,NULL),(2,11,'acd74134-be0c-42c7-bf37-eb5d6b2f555a',6,'1993-04-23','#1 Bonifacio Street','Bambang','City of Pasig','Metro Manila','luzon','single','+639663603172','Filipino','Programmer',1,'2022-04-20','PCMC',NULL,'','activated','20c5c4fa-c040-473c-9236-0192efed2643',0,NULL,'2025-06-15 14:06:37','2025-06-15 14:06:48',NULL,0,NULL);
/*!40000 ALTER TABLE `donors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_notifications`
--

DROP TABLE IF EXISTS `email_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recipients` json NOT NULL,
  `cc` json DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `files` json DEFAULT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `email_notifications_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_notifications`
--

LOCK TABLES `email_notifications` WRITE;
/*!40000 ALTER TABLE `email_notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_time_schedules`
--

DROP TABLE IF EXISTS `event_time_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_time_schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `blood_donation_event_id` int NOT NULL,
  `time_start` time NOT NULL,
  `time_end` time NOT NULL,
  `status` enum('open','closed') NOT NULL DEFAULT 'open',
  `has_limit` tinyint(1) DEFAULT '0',
  `max_limit` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `blood_donation_event_id` (`blood_donation_event_id`),
  CONSTRAINT `event_time_schedules_ibfk_1` FOREIGN KEY (`blood_donation_event_id`) REFERENCES `blood_donation_events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_time_schedules`
--

LOCK TABLES `event_time_schedules` WRITE;
/*!40000 ALTER TABLE `event_time_schedules` DISABLE KEYS */;
INSERT INTO `event_time_schedules` VALUES (1,1,'08:00:00','17:00:00','open',0,0,'2025-06-10 11:53:21','2025-06-10 11:53:21'),(4,3,'08:00:00','12:00:00','open',0,0,'2025-06-10 12:14:24','2025-06-10 12:14:24'),(5,3,'12:01:00','14:00:00','open',0,0,'2025-06-10 12:14:24','2025-06-10 12:14:24'),(8,2,'08:00:00','12:00:00','open',1,200,'2025-06-10 15:09:11','2025-06-10 15:09:11'),(9,2,'12:01:00','15:00:00','open',1,200,'2025-06-10 15:09:11','2025-06-10 15:09:11'),(10,2,'15:01:00','17:00:00','open',0,0,'2025-06-10 15:09:11','2025-06-10 15:09:11'),(13,4,'08:00:00','12:00:00','open',0,0,'2025-06-15 11:03:51','2025-06-15 11:03:51');
/*!40000 ALTER TABLE `event_time_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `has_child` tinyint(1) NOT NULL DEFAULT '0',
  `link` varchar(150) DEFAULT NULL,
  `icon` varchar(100) NOT NULL DEFAULT 'FaHome',
  `ctr` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `created_date` datetime NOT NULL,
  `mod_by` int DEFAULT NULL,
  `mod_date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `physical_examinations`
--

DROP TABLE IF EXISTS `physical_examinations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `physical_examinations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `donor_id` int NOT NULL,
  `appointment_id` int NOT NULL,
  `event_id` int NOT NULL,
  `examiner_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `blood_pressure` varchar(20) DEFAULT NULL,
  `pulse_rate` int DEFAULT NULL,
  `hemoglobin_level` varchar(20) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `temperature` decimal(4,1) DEFAULT NULL,
  `eligibility_status` enum('ACCEPTED','TEMPORARILY-DEFERRED','PERMANENTLY-DEFERRED') NOT NULL DEFAULT 'ACCEPTED',
  `deferral_reason` text,
  `remarks` text,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `donor_id` (`donor_id`),
  KEY `appointment_id` (`appointment_id`),
  KEY `event_id` (`event_id`),
  KEY `examiner_id` (`examiner_id`),
  CONSTRAINT `physical_examinations_ibfk_25` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `physical_examinations_ibfk_26` FOREIGN KEY (`appointment_id`) REFERENCES `donor_appointment_infos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `physical_examinations_ibfk_27` FOREIGN KEY (`event_id`) REFERENCES `blood_donation_events` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `physical_examinations_ibfk_28` FOREIGN KEY (`examiner_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `physical_examinations`
--

LOCK TABLES `physical_examinations` WRITE;
/*!40000 ALTER TABLE `physical_examinations` DISABLE KEYS */;
INSERT INTO `physical_examinations` VALUES (1,1,8,1,'20c5c4fa-c040-473c-9236-0192efed2643','120/70',100,'13.5/17.5',50.00,36.0,'ACCEPTED','','Remarks 1','20c5c4fa-c040-473c-9236-0192efed2643','2025-06-22 07:36:51','2025-06-22 07:51:04');
/*!40000 ALTER TABLE `physical_examinations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) DEFAULT NULL,
  `url` varchar(150) NOT NULL DEFAULT '/portal',
  `icon` varchar(150) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin','/portal/admin','FaUserLock','2025-06-04 11:18:00','2025-06-04 11:18:00'),(2,'Agency Administrator','/portal/hosts','FaUser','2025-06-04 11:18:00','2025-06-04 11:18:00'),(3,'Organizer','/portal/hosts','FaUser','2025-06-04 11:18:00','2025-06-04 11:18:00'),(4,'Donor','/portal/donors','FaUser','2025-06-04 11:18:00','2025-06-04 11:18:00'),(5,'Developer','/portal/admin','FaUser','2025-06-04 11:18:00','2025-06-04 11:18:00');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `screening_details`
--

DROP TABLE IF EXISTS `screening_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `screening_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `physical_examination_id` int NOT NULL,
  `question_id` int NOT NULL,
  `response` enum('YES','NO','N/A') NOT NULL,
  `additional_info` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `physical_examination_id` (`physical_examination_id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `screening_details_ibfk_13` FOREIGN KEY (`physical_examination_id`) REFERENCES `physical_examinations` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `screening_details_ibfk_14` FOREIGN KEY (`question_id`) REFERENCES `screening_questions` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `screening_details`
--

LOCK TABLES `screening_details` WRITE;
/*!40000 ALTER TABLE `screening_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `screening_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `screening_questions`
--

DROP TABLE IF EXISTS `screening_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `screening_questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_text` text NOT NULL,
  `question_type` enum('GENERAL','MEDICAL','TRAVEL','LIFESTYLE') NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `screening_questions`
--

LOCK TABLES `screening_questions` WRITE;
/*!40000 ALTER TABLE `screening_questions` DISABLE KEYS */;
/*!40000 ALTER TABLE `screening_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` datetime NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sessionToken` (`session_token`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_menu`
--

DROP TABLE IF EXISTS `sub_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `menu_id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `has_child` varchar(10) NOT NULL DEFAULT '0',
  `link` varchar(150) DEFAULT NULL,
  `icon` varchar(100) NOT NULL DEFAULT 'FaHome',
  `ctr` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `created_date` datetime NOT NULL,
  `mod_by` int DEFAULT NULL,
  `mod_date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `menu_id` (`menu_id`),
  CONSTRAINT `sub_menu_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_menu`
--

LOCK TABLES `sub_menu` WRITE;
/*!40000 ALTER TABLE `sub_menu` DISABLE KEYS */;
/*!40000 ALTER TABLE `sub_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `role_id` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_roles_role_id_user_id_unique` (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_roles_ibfk_37` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_38` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,'20c5c4fa-c040-473c-9236-0192efed2643',1,1,'2025-06-04 11:20:16','2025-06-04 11:20:16'),(2,'20c5c4fa-c040-473c-9236-0192efed2643',2,1,'2025-06-04 11:37:01','2025-06-04 12:58:34'),(3,'20c5c4fa-c040-473c-9236-0192efed2643',3,1,'2025-06-04 11:37:01','2025-06-04 13:04:21'),(5,'20c5c4fa-c040-473c-9236-0192efed2643',5,0,'2025-06-04 11:37:01','2025-06-04 11:37:01'),(6,'2008dfe1-f12a-4f93-b457-b8bba552191f',4,1,'2025-06-12 14:55:21','2025-06-12 15:15:05'),(7,'6269d821-7644-483d-b64e-52165b5e0132',2,0,'2025-06-15 03:40:22','2025-06-15 03:40:22'),(8,'4b5e18eb-f0f4-4eff-b117-53d19f946356',2,0,'2025-06-15 03:50:15','2025-06-15 03:50:15'),(9,'acd74134-be0c-42c7-bf37-eb5d6b2f555a',4,1,'2025-06-15 14:06:37','2025-06-15 14:06:48'),(11,'4f141502-132d-40f8-8fdc-697292d6977b',2,0,'2025-06-17 14:30:52','2025-06-17 14:30:52'),(12,'d1b842d1-0a2c-4c77-9c02-e1d71daf849d',3,0,'2025-06-17 14:34:53','2025-06-17 14:34:53'),(14,'0e7d5290-6613-45b6-a2ae-05017569da0b',2,0,'2025-06-22 09:55:42','2025-06-22 09:55:42');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(250) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `email_verified` datetime DEFAULT NULL,
  `password` varchar(255) NOT NULL DEFAULT '$2b$10$rpfHHgG95HJ/wYTAhPIwROuFaeVK2YMysfDUtj4v7PUQSY8jT37Ve',
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `prefix` varchar(50) DEFAULT NULL,
  `suffix` varchar(50) DEFAULT NULL,
  `gender` enum('male','female') DEFAULT 'male',
  `is_active` tinyint NOT NULL DEFAULT '1',
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('0e7d5290-6613-45b6-a2ae-05017569da0b','Juan Dela Cruz','agencyhead1@email.com',NULL,NULL,'$2b$10$XD0Bo0gQj9/KiWaVrCQsmOuosewCinKKjJs43pWoq0p5NbKbSFGRq','Juan','Dela Cruz','Carlos',NULL,NULL,'male',1,NULL,'2025-06-22 09:55:42','2025-06-22 09:55:42'),('2008dfe1-f12a-4f93-b457-b8bba552191f','Vanesa Donor','markoliver01728@gmail.com',NULL,NULL,'$2b$10$NDiR2/8amv2bVHJGLbm5RusSFlKgmuulnzj8JGZ.1FssBx2FdUr02','Vanesa','Donor','Car',NULL,NULL,'female',1,'20c5c4fa-c040-473c-9236-0192efed2643','2025-06-12 14:55:21','2025-06-12 14:55:21'),('20c5c4fa-c040-473c-9236-0192efed2643','Mark Admin','mark@email.com',NULL,NULL,'$2b$10$UMcnXtu2ZopmYkZ2zI5DW.62Y9dnIv/YoGJxYwfTLA2sk29oBmvSS','Mark','Admin','',NULL,NULL,'male',1,'20c5c4fa-c040-473c-9236-0192efed2643','2025-06-04 11:20:16','2025-06-04 11:20:16'),('4b5e18eb-f0f4-4eff-b117-53d19f946356','Juan Carlos','mark15@email.com',NULL,NULL,'$2b$10$dUk19ZhbO/HPsI3I8h5lKepvHSPTO.TCFfPenNOfAJpkwmRtb4Uvy','Juan','Carlos','',NULL,NULL,'male',1,'20c5c4fa-c040-473c-9236-0192efed2643','2025-06-15 03:50:15','2025-06-15 03:50:15'),('4f141502-132d-40f8-8fdc-697292d6977b','Agency One Administrator','agency1@email.com',NULL,NULL,'$2b$10$CBD5.RTaIaAHiWehMkzNYuJhZAxRj/kHR19wpe6Txw0Dojw67xaae','Agency One','Administrator','Ad',NULL,NULL,'male',1,NULL,'2025-06-17 14:30:52','2025-06-17 14:30:52'),('6269d821-7644-483d-b64e-52165b5e0132','Vanessa Roman','vanessa@email.com',NULL,NULL,'$2b$10$iGG4STVv8dK0BH84r0ZlGOMIqy7sovpz7hoK85uaACjfQ1va79hmO','Vanessa','Roman',NULL,NULL,NULL,'female',1,NULL,'2025-06-15 03:40:22','2025-06-15 03:40:22'),('76a2608b-524e-43b3-9b38-44cb9b6a6ac5','Ottis Murphy','Gracie81@yahoo.com',NULL,NULL,'$2b$10$JnPpj9Pkpq1umbs9donVqeMFKL7bcyek1999JK0LjhQCB4do8oLn2','Ottis','Murphy',NULL,NULL,NULL,'male',1,NULL,'2025-06-04 12:55:59','2025-06-04 12:55:59'),('acd74134-be0c-42c7-bf37-eb5d6b2f555a','Kram Nomar','mark40@email.com',NULL,NULL,'$2b$10$kFe7bkUoIdIcwlmvgRA7t./uCZii6kU5PV3Y3Hi0G8pkI.nsiIfCm','Kram','Nomar',NULL,NULL,NULL,'female',1,NULL,'2025-06-15 14:06:37','2025-06-15 14:06:37'),('d1b842d1-0a2c-4c77-9c02-e1d71daf849d','Mark Roman','mark29@email.com',NULL,NULL,'$2b$10$lEFnJmyVP0jxPwY4XaDx/.JbBPGH9LfYy9QmxdGedNlTms3bSDr5e','Mark','Roman','',NULL,NULL,'male',1,NULL,'2025-06-17 14:34:53','2025-06-17 14:34:53'),('d6a96fe5-0560-4c35-9536-734614b89b0e','Darien Mohr','Dax.Reichel23@gmail.com',NULL,NULL,'$2b$10$giN8hhdg6sl6tmJOZqA6keFxLLipiqkWWoovP3HIm8n.EemlibCzq','Darien','Mohr',NULL,NULL,NULL,'female',1,NULL,'2025-06-04 12:55:59','2025-06-04 12:55:59'),('f4ea12b5-952b-42ab-8997-9648904ab9ca','Art Kulas','Eugenia.Hilpert35@yahoo.com',NULL,NULL,'$2b$10$2O/yIpJf.YNNFsimqrTv1.2.4bsNHnQsDz/vuq1HFikuLjuprIN.u','Art','Kulas',NULL,NULL,NULL,NULL,1,NULL,'2025-06-04 12:55:59','2025-06-04 12:55:59');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification_tokens`
--

DROP TABLE IF EXISTS `verification_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification_tokens` (
  `token` varchar(255) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `expires` datetime NOT NULL,
  PRIMARY KEY (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification_tokens`
--

LOCK TABLES `verification_tokens` WRITE;
/*!40000 ALTER TABLE `verification_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `verification_tokens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-22 23:28:24
