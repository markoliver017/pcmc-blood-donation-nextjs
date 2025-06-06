-- docker exec -it mysql-server mysqldump -u root -proot blood_donation_db > blood_donation_db.sql

mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 9.2.0, for Linux (x86_64)
--
-- Host: localhost    Database: blood_donation_db
-- ------------------------------------------------------
-- Server version	9.2.0

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

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `type` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `provider_account_id` varchar(255) NOT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `expires_at` int DEFAULT NULL,
  `token_type` varchar(255) DEFAULT NULL,
  `scope` varchar(255) DEFAULT NULL,
  `id_token` text,
  `session_state` varchar(255) DEFAULT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES ('b70ca6e5-28f8-4f3f-99a6-594be5867913','oauth','github','122749342',NULL,'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',NULL,'bearer','read:user,user:email',NULL,NULL,'8ec80bd7-a4ca-4455-be33-20b330964bf0');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agencies`
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
  `comments` text,
  `status` enum('for approval','rejected','activated','deactivated') NOT NULL DEFAULT 'for approval',
  `organization_type` enum('business','media','government','church','education','healthcare') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `city_municipality` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL DEFAULT 'Metro Manila',
  `region` varchar(255) NOT NULL DEFAULT 'luzon',
  `remarks` varchar(255) DEFAULT NULL,
  `verified_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `agencies_name_unique` (`name`),
  KEY `head_id` (`head_id`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `agencies_ibfk_1` FOREIGN KEY (`head_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `agencies_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agencies`
--

LOCK TABLES `agencies` WRITE;
/*!40000 ALTER TABLE `agencies` DISABLE KEYS */;
INSERT INTO `agencies` VALUES (11,'207ac622-41c8-4f4d-948d-419bd6c0a795','http://10.0.0.185:5000/uploads/eada3c3c-4e1a-461e-8233-cf1deffbaaa2-profile-1747880476904.png','PCMC','+639663603172','PCMC Building','Concepcion Uno','my message','activated','government','2025-05-22 02:22:38','2025-05-27 06:15:30','City of Marikina','Metro Manila','luzon',NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795',NULL),(15,'207ac622-41c8-4f4d-948d-419bd6c0a795',NULL,'PCMC 4','+639663603172','PCMC Building','Bagong Katipunan','','activated','government','2025-05-22 05:34:29','2025-05-27 06:18:08','City of Pasig','Metro Manila','luzon',NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795',NULL),(17,'62e044f9-97b9-42e0-b1f9-504f0530713f',NULL,'PCMC 6','+639663603172','PCMC Building','Baesa','','activated','government','2025-05-30 00:06:44','2025-05-30 00:54:36','Quezon City','Metro Manila','luzon',NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795',NULL),(18,'806e519a-8b1d-4176-854a-68394bd84d09',NULL,'PCMC 7','+639663603172','PCMC 6 Building','Salawag','This is my message from PCMC 7','activated','government','2025-05-30 00:09:14','2025-05-30 00:54:41','City of Dasmari├▒as','Cavite','luzon',NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795',NULL),(20,'b10b971a-ad59-4cc0-bde2-65136c3c37ac','http://10.0.0.185:5000/uploads/pcmc-building-1748566402666.png','Neo','+639663603172','Neo Building','Malanday','','activated','government','2025-05-30 00:53:28','2025-05-30 00:54:46','City of Marikina','Metro Manila','luzon',NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795',NULL);
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
  `contact_number` varchar(15) NOT NULL,
  `status` enum('for approval','active','deactivated') NOT NULL DEFAULT 'for approval',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `agency_id` (`agency_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `agency_coordinators_ibfk_49` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `agency_coordinators_ibfk_50` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agency_coordinators`
--

LOCK TABLES `agency_coordinators` WRITE;
/*!40000 ALTER TABLE `agency_coordinators` DISABLE KEYS */;
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
  CONSTRAINT `audit_trails_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_trails`
--

LOCK TABLES `audit_trails` WRITE;
/*!40000 ALTER TABLE `audit_trails` DISABLE KEYS */;
INSERT INTO `audit_trails` VALUES (32,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','CREATE',0,'A new user has been successfully created. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-21 07:55:04','2025-05-21 07:55:04'),(33,'d520c74d-c7fa-408d-aa0d-4aa2ed91c681','users','CREATE',0,'A new user has been successfully created. ID#: d520c74d-c7fa-408d-aa0d-4aa2ed91c681','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-21 08:05:05','2025-05-21 08:05:05'),(34,'716fed41-223b-4451-a93c-ca4f9aecfa47','users','CREATE',0,'A new user has been successfully created. ID#: 716fed41-223b-4451-a93c-ca4f9aecfa47','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-21 08:06:25','2025-05-21 08:06:25'),(35,'4e1094fa-fdc4-4437-beb1-2e498f6176ef','agencies','CREATE',0,'A new agency has been successfully created. ID#: 11','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-22 02:22:38','2025-05-22 02:22:38'),(36,'e98dbaae-8ebd-4412-b010-c0ddfe7c4f23','users','CREATE',0,'A new user has been successfully created. ID#: e98dbaae-8ebd-4412-b010-c0ddfe7c4f23 with role Agency Administrator','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-22 03:34:09','2025-05-22 03:34:09'),(37,'c13c8af1-4f8b-4baf-9f46-5c9f4c0f348e','users','CREATE',0,'A new user has been successfully created. ID#: c13c8af1-4f8b-4baf-9f46-5c9f4c0f348e with role Agency Administrator','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-22 03:44:41','2025-05-22 03:44:41'),(38,'207ac622-41c8-4f4d-948d-419bd6c0a795','AGENCY ACTION','CREATE',0,'A new user role (Agency Administrator) has been successfully added to user ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-22 05:19:32','2025-05-22 05:19:32'),(39,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','CREATE',0,'A new agency has been successfully created. ID#: 14','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-22 05:33:13','2025-05-22 05:33:13'),(40,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','CREATE',0,'A new agency has been successfully created. ID#: 15','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-22 05:34:29','2025-05-22 05:34:29'),(41,'7838dca3-13bd-41f0-9bf1-ef6707436ea2','users','CREATE',0,'A new user has been successfully created. ID#: 7838dca3-13bd-41f0-9bf1-ef6707436ea2.','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 00:39:52','2025-05-23 00:39:52'),(42,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','CREATE',0,'A new user has been successfully created. ID#: b284b85b-cda1-4f98-9804-08563b0a06c9.','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 01:35:48','2025-05-23 01:35:48'),(43,'b284b85b-cda1-4f98-9804-08563b0a06c9','users','UPDATE',0,'User has been successfully updated. ID#: b284b85b-cda1-4f98-9804-08563b0a06c9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 01:54:33','2025-05-23 01:54:33'),(44,'b284b85b-cda1-4f98-9804-08563b0a06c9','users','UPDATE',0,'User has been successfully updated. ID#: b284b85b-cda1-4f98-9804-08563b0a06c9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 01:57:27','2025-05-23 01:57:27'),(45,'b284b85b-cda1-4f98-9804-08563b0a06c9','users','UPDATE',0,'User has been successfully updated. ID#: b284b85b-cda1-4f98-9804-08563b0a06c9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 02:00:20','2025-05-23 02:00:20'),(46,'b284b85b-cda1-4f98-9804-08563b0a06c9','users','UPDATE',0,'User has been successfully updated. ID#: b284b85b-cda1-4f98-9804-08563b0a06c9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 02:15:35','2025-05-23 02:15:35'),(47,'b284b85b-cda1-4f98-9804-08563b0a06c9','users','UPDATE',0,'User has been successfully updated. ID#: b284b85b-cda1-4f98-9804-08563b0a06c9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 02:16:18','2025-05-23 02:16:18'),(48,'b284b85b-cda1-4f98-9804-08563b0a06c9','users','UPDATE',0,'User has been successfully updated. ID#: b284b85b-cda1-4f98-9804-08563b0a06c9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 02:54:53','2025-05-23 02:54:53'),(49,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','UPDATE',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 06:13:31','2025-05-23 06:13:31'),(50,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','updateUserBasicInfo',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:01:49','2025-05-27 02:01:49'),(51,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','updateUserBasicInfo',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:02:26','2025-05-27 02:02:26'),(52,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','UPDATE',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:08:45','2025-05-27 02:08:45'),(53,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','UPDATE',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:28:45','2025-05-27 02:28:45'),(54,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','UPDATE',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:33:15','2025-05-27 02:33:15'),(55,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','UPDATE',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:42:24','2025-05-27 02:42:24'),(56,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','UPDATE',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:42:28','2025-05-27 02:42:28'),(57,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','UPDATE',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:43:38','2025-05-27 02:43:38'),(58,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','UPDATE',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:44:11','2025-05-27 02:44:11'),(59,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 11','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0',NULL,'2025-05-27 06:15:30','2025-05-27 06:15:30'),(60,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 15','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0',NULL,'2025-05-27 06:18:08','2025-05-27 06:18:08'),(61,'eb040f6e-585c-4cb6-8205-7883d2e00da7','users','CREATE',0,'A new user has been successfully created. ID#: eb040f6e-585c-4cb6-8205-7883d2e00da7.','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-05-28 00:27:13','2025-05-28 00:27:13'),(62,'62e044f9-97b9-42e0-b1f9-504f0530713f','agencies','CREATE',0,'A new agency has been successfully created. Agency ID#: 17 with User account: 62e044f9-97b9-42e0-b1f9-504f0530713f','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-05-30 00:06:44','2025-05-30 00:06:44'),(63,'806e519a-8b1d-4176-854a-68394bd84d09','agencies','CREATE',0,'A new agency has been successfully created. Agency ID#: 18 with User account: 806e519a-8b1d-4176-854a-68394bd84d09','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-05-30 00:09:14','2025-05-30 00:09:14'),(64,'b10b971a-ad59-4cc0-bde2-65136c3c37ac','agencies','CREATE',0,'A new agency has been successfully created. Agency ID#: 20 with User account: b10b971a-ad59-4cc0-bde2-65136c3c37ac','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-05-30 00:53:28','2025-05-30 00:53:28'),(65,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 17','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-05-30 00:54:37','2025-05-30 00:54:37'),(66,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 18','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-05-30 00:54:41','2025-05-30 00:54:41'),(67,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 20','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-05-30 00:54:46','2025-05-30 00:54:46');
/*!40000 ALTER TABLE `audit_trails` ENABLE KEYS */;
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
  `date_range` varchar(255) NOT NULL,
  `status` enum('scheduled','for approval','cancelled') NOT NULL DEFAULT 'for approval',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `agency_id` (`agency_id`),
  KEY `requester_id` (`requester_id`),
  CONSTRAINT `blood_donation_events_ibfk_49` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `blood_donation_events_ibfk_50` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_donation_events`
--

LOCK TABLES `blood_donation_events` WRITE;
/*!40000 ALTER TABLE `blood_donation_events` DISABLE KEYS */;
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
  CONSTRAINT `blood_requests_ibfk_49` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `blood_requests_ibfk_50` FOREIGN KEY (`blood_type_id`) REFERENCES `blood_types` (`id`) ON UPDATE CASCADE
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
-- Table structure for table `booking_schedules`
--

DROP TABLE IF EXISTS `booking_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `blood_donation_event_id` int NOT NULL,
  `date` date NOT NULL,
  `time_start` time NOT NULL,
  `time_end` time NOT NULL,
  `status` enum('open','closed') NOT NULL DEFAULT 'open',
  `max_limit` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `blood_donation_event_id` (`blood_donation_event_id`),
  CONSTRAINT `booking_schedules_ibfk_1` FOREIGN KEY (`blood_donation_event_id`) REFERENCES `blood_donation_events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_schedules`
--

LOCK TABLES `booking_schedules` WRITE;
/*!40000 ALTER TABLE `booking_schedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_schedules` ENABLE KEYS */;
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
  `booking_schedule_id` int NOT NULL,
  `donor_type` enum('replacement','volunteer') NOT NULL,
  `patient_name` varchar(255) DEFAULT NULL,
  `relation` varchar(255) DEFAULT NULL,
  `collection_method` enum('whole blood','apheresis') NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed','rejected') NOT NULL DEFAULT 'pending',
  `comments` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `donor_id` (`donor_id`),
  KEY `booking_schedule_id` (`booking_schedule_id`),
  CONSTRAINT `donor_appointment_infos_ibfk_49` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `donor_appointment_infos_ibfk_50` FOREIGN KEY (`booking_schedule_id`) REFERENCES `booking_schedules` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donor_appointment_infos`
--

LOCK TABLES `donor_appointment_infos` WRITE;
/*!40000 ALTER TABLE `donor_appointment_infos` DISABLE KEYS */;
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
  `date_of_birth` date NOT NULL,
  `civil_status` enum('single','married','divorced','separated','widowed') NOT NULL DEFAULT 'single',
  `contact_number` varchar(15) NOT NULL,
  `nationality` varchar(255) NOT NULL DEFAULT 'Filipino',
  `occupation` varchar(255) DEFAULT NULL,
  `id_url` text,
  `is_regular_donor` tinyint(1) DEFAULT '0',
  `blood_type_id` int DEFAULT NULL,
  `last_donation_date` varchar(255) DEFAULT NULL,
  `blood_service_facility` varchar(255) DEFAULT NULL,
  `address` text NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `city_municipality` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL DEFAULT 'Metro Manila',
  `region` varchar(255) NOT NULL DEFAULT 'luzon',
  `comments` text,
  `is_verified` tinyint(1) DEFAULT '0',
  `verified_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `agency_id` (`agency_id`),
  KEY `user_id` (`user_id`),
  KEY `blood_type_id` (`blood_type_id`),
  KEY `verified_by` (`verified_by`),
  CONSTRAINT `donors_ibfk_100` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `donors_ibfk_97` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `donors_ibfk_98` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `donors_ibfk_99` FOREIGN KEY (`blood_type_id`) REFERENCES `blood_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donors`
--

LOCK TABLES `donors` WRITE;
/*!40000 ALTER TABLE `donors` DISABLE KEYS */;
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
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` text NOT NULL,
  `type` enum('online','file_upload') NOT NULL DEFAULT 'file_upload',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES (1,'/uploads/blood icon-1746753629051.jpg','file_upload','2025-05-09 01:22:05','2025-05-09 01:22:05'),(2,'http://localhost:5000/uploads/woman-1746754635461.png','file_upload','2025-05-09 01:37:37','2025-05-09 01:37:37'),(3,'http://localhost:5000/uploads/pedbc mobile app-1746755673737.jpg','file_upload','2025-05-09 01:54:33','2025-05-09 01:54:33'),(4,'http://localhost:5000/uploads/learn more-1746755958558.jpg','file_upload','2025-05-09 01:59:18','2025-05-09 01:59:18'),(5,'http://localhost:5000/uploads/learn more-1746756158894.jpg','file_upload','2025-05-09 02:02:38','2025-05-09 02:02:38'),(6,'http://localhost:5000/uploads/hacker-1746756236099.png','file_upload','2025-05-09 02:03:56','2025-05-09 02:03:56'),(7,'http://localhost:5000/uploads/overview-1746756548572.jpg','file_upload','2025-05-09 02:09:08','2025-05-09 02:09:08'),(8,'http://localhost:5000/uploads/profile-1746757162371.png','file_upload','2025-05-09 02:19:22','2025-05-09 02:19:22'),(9,'http://localhost:5000/uploads/pcmc logo-1746757514541.png','file_upload','2025-05-09 02:25:14','2025-05-09 02:25:14'),(10,'http://localhost:5000/uploads/pcmc logo-1746757650034.png','file_upload','2025-05-09 02:27:30','2025-05-09 02:27:30'),(11,'http://localhost:5000/uploads/learn more-1746772456316.jpg','file_upload','2025-05-09 06:34:16','2025-05-09 06:34:16'),(12,'http://localhost:5000/uploads/profile-1746773828829.png','file_upload','2025-05-09 06:57:08','2025-05-09 06:57:08'),(13,'http://localhost:5000/uploads/blood icon-1747202721157.jpg','file_upload','2025-05-14 06:05:21','2025-05-14 06:05:21'),(14,'http://localhost:5000/uploads/mission-1747203128385.png','file_upload','2025-05-14 06:12:08','2025-05-14 06:12:08'),(15,'http://localhost:5000/uploads/overview-1747203178879.jpg','file_upload','2025-05-14 06:12:58','2025-05-14 06:12:58'),(16,'http://localhost:5000/uploads/mission-1747203222979.jpg','file_upload','2025-05-14 06:13:42','2025-05-14 06:13:42'),(17,'http://localhost:5000/uploads/pcmc logo-1747203251376.png','file_upload','2025-05-14 06:14:11','2025-05-14 06:14:11'),(18,'http://localhost:5000/uploads/pcmc logo-1747203371722.png','file_upload','2025-05-14 06:16:11','2025-05-14 06:16:11'),(19,'http://localhost:5000/uploads/pcmc logo-1747203480919.png','file_upload','2025-05-14 06:18:00','2025-05-14 06:18:00'),(20,'http://localhost:5000/uploads/mission-1747203689784.png','file_upload','2025-05-14 06:21:29','2025-05-14 06:21:29'),(21,'http://localhost:5000/uploads/learn more-1747203767733.jpg','file_upload','2025-05-14 06:22:47','2025-05-14 06:22:47'),(22,'http://localhost:5000/uploads/blood icon-1747207179752.jpg','file_upload','2025-05-14 07:19:39','2025-05-14 07:19:39'),(23,'http://localhost:5000/uploads/hacker-1747207770811.png','file_upload','2025-05-14 07:29:30','2025-05-14 07:29:30'),(24,'http://localhost:5000/uploads/footer-1747207803639.jpg','file_upload','2025-05-14 07:30:03','2025-05-14 07:30:03'),(25,'http://localhost:5000/uploads/pcmc logo-1747207833647.png','file_upload','2025-05-14 07:30:33','2025-05-14 07:30:33'),(26,'http://localhost:5000/uploads/blood donor page 2-1747207899460.jpg','file_upload','2025-05-14 07:31:39','2025-05-14 07:31:39'),(27,'http://localhost:5000/uploads/pcmc logo-1747208081739.png','file_upload','2025-05-14 07:34:41','2025-05-14 07:34:41'),(28,'http://localhost:5000/uploads/pcmc logo-1747208132007.png','file_upload','2025-05-14 07:35:32','2025-05-14 07:35:32');
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
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
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) DEFAULT NULL,
  `icon` varchar(150) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `url` varchar(150) NOT NULL DEFAULT '/portal',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin','FaUserLock','2025-05-09 00:14:16','2025-05-09 00:14:16','/portal/admin'),(2,'Donor','User','2025-05-09 00:14:16','2025-05-09 00:14:16','/portal/donors'),(3,'Developer','MdDeveloperMode','2025-05-09 00:14:16','2025-05-09 00:14:16','/portal/admin'),(4,'Agency Administrator','FaUserLock','2025-05-09 00:14:16','2025-05-09 00:14:16','/portal/hosts'),(5,'Organizer','FaUserLock','2025-05-09 00:14:16','2025-05-09 00:14:16','/portal/organizers');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
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
  CONSTRAINT `user_roles_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_14` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (4,'207ac622-41c8-4f4d-948d-419bd6c0a795',1,1,'2025-05-22 06:35:22','2025-05-22 06:35:22'),(6,'4e1094fa-fdc4-4437-beb1-2e498f6176ef',1,1,'2025-05-22 07:35:13','2025-05-22 07:35:13'),(7,'7838dca3-13bd-41f0-9bf1-ef6707436ea2',4,1,'2025-05-23 00:39:52','2025-05-23 00:39:52'),(9,'b284b85b-cda1-4f98-9804-08563b0a06c9',1,1,'2025-05-23 01:35:48','2025-05-23 01:35:48'),(11,'b284b85b-cda1-4f98-9804-08563b0a06c9',5,1,'2025-05-23 01:57:27','2025-05-23 01:57:27'),(12,'b284b85b-cda1-4f98-9804-08563b0a06c9',2,1,'2025-05-23 02:54:53','2025-05-23 02:54:53'),(13,'207ac622-41c8-4f4d-948d-419bd6c0a795',4,1,'2025-05-23 06:13:31','2025-05-23 06:13:31'),(14,'207ac622-41c8-4f4d-948d-419bd6c0a795',5,1,'2025-05-23 06:13:31','2025-05-23 06:13:31'),(15,'eb040f6e-585c-4cb6-8205-7883d2e00da7',2,0,'2025-05-28 00:27:13','2025-05-28 00:27:13'),(17,'62e044f9-97b9-42e0-b1f9-504f0530713f',4,1,'2025-05-30 00:06:44','2025-05-30 00:54:37'),(18,'806e519a-8b1d-4176-854a-68394bd84d09',4,1,'2025-05-30 00:09:14','2025-05-30 00:54:41'),(20,'b10b971a-ad59-4cc0-bde2-65136c3c37ac',4,1,'2025-05-30 00:53:28','2025-05-30 00:54:46');
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
  `password` varchar(255) NOT NULL DEFAULT '$2b$10$h/pYYeTzdUqM3WZjNzMSJe/VjkMd0spUDqUTQMmrikC84Q3IBdMvm',
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
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `email_32` (`email`),
  UNIQUE KEY `email_33` (`email`),
  UNIQUE KEY `email_34` (`email`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('207ac622-41c8-4f4d-948d-419bd6c0a795','Mark Nomar','mark@email.com',NULL,NULL,'$2b$10$zUyh8I4/pEAxxWI04vPqku3N5jjxek5dJjsf212KGR4u/CyoyUT5C','Mark','Nomar','Car',NULL,NULL,'male',1,'207ac622-41c8-4f4d-948d-419bd6c0a795','2025-05-21 07:55:04','2025-05-21 07:55:04'),('4e1094fa-fdc4-4437-beb1-2e498f6176ef','Marguerite Parisian','admin@email.com',NULL,NULL,'$2b$10$/xmwTJUU9Nkj2dhJ.U/89.BHyfCLHf4vU.ZWbyVLfFYu3UlSaL5Dq','Marguerite','Parisian',NULL,NULL,NULL,'female',1,NULL,'2025-05-21 01:40:56','2025-05-21 01:40:56'),('62e044f9-97b9-42e0-b1f9-504f0530713f','Mark Roman','mark29@email.com',NULL,NULL,'$2b$10$TxmjSWhb5EcgnXkw3/T5uO64xvVOT8l6/8jnufR0w2kc9ocoYt6f6','Mark','Roman',NULL,NULL,NULL,'male',1,NULL,'2025-05-30 00:06:44','2025-05-30 00:06:44'),('6e7a8c3c-ad0a-4390-b412-699714306289','Lindsey Johnston','Aracely63@yahoo.com',NULL,NULL,'$2b$10$ycL4PiVcwuKvIJTylU4VUOtzz5sdRDuUwiKTuBMJWK7KrCwwLt2fG','Lindsey','Johnston',NULL,NULL,NULL,NULL,1,NULL,'2025-05-21 01:41:12','2025-05-21 01:41:12'),('716fed41-223b-4451-a93c-ca4f9aecfa47','Mark Roman','admin2@email.com',NULL,NULL,'$2b$10$F4pDUYmdQ8uaMohhUDf7B.Oi1yN64k7jxo2laKniVq9XzP8Mu13GO','Mark','Roman',NULL,NULL,NULL,'female',1,NULL,'2025-05-21 08:06:25','2025-05-21 08:06:25'),('7838dca3-13bd-41f0-9bf1-ef6707436ea2','Mark Roman','mark23@email.com',NULL,NULL,'$2b$10$PgWD/jrYL0w/JvLbnoL3EuVRhI27ol1fxLakFYnbgbrbfBIPMLOAi','Mark','Roman',NULL,NULL,NULL,'male',1,NULL,'2025-05-23 00:39:52','2025-05-23 00:39:52'),('806e519a-8b1d-4176-854a-68394bd84d09','Krame Nomar','mark30@email.com','http://10.0.0.185:5000/uploads/eada3c3c-4e1a-461e-8233-cf1deffbaaa2-profile-1748563749610.png',NULL,'$2b$10$Qb4PYqkG0UiTxl23.hEXDOkEc4YR62vwvgo5TowtdxY7I77cBaele','Krame','Nomar',NULL,NULL,NULL,'male',1,NULL,'2025-05-30 00:09:14','2025-05-30 00:09:14'),('8ec80bd7-a4ca-4455-be33-20b330964bf0','Oliver','markoliver01728@gmail.com','https://avatars.githubusercontent.com/u/122749342?v=4',NULL,'$2b$10$8X9KB8U7oTakQBBXr8U.weBUL3KYMuqSYwd18VLvq6PHXdWihMNCa',NULL,NULL,NULL,NULL,NULL,'male',1,NULL,'2025-05-21 01:46:39','2025-05-21 01:46:39'),('b10b971a-ad59-4cc0-bde2-65136c3c37ac','Neo Roman','neo29@email.com','http://10.0.0.185:5000/uploads/avatar 2-1748566402739.png',NULL,'$2b$10$WxUCSwJrkQOTAhsT8mWsR.0TiOjgbrYvm/6bPEBNgFqO27FU7jxnS','Neo','Roman',NULL,NULL,NULL,'female',1,NULL,'2025-05-30 00:53:28','2025-05-30 00:53:28'),('b284b85b-cda1-4f98-9804-08563b0a06c9','Kram Romano','mark24@email.com',NULL,NULL,'$2b$10$5OCO4ZxXuvvJN4UH.eGnAOH.3slGGornHCAkx6RoW7ZL/a1Y2QFVW','Kram','Romano','Carmesis',NULL,NULL,'male',1,'b284b85b-cda1-4f98-9804-08563b0a06c9','2025-05-23 01:35:48','2025-05-23 01:35:48'),('c13c8af1-4f8b-4baf-9f46-5c9f4c0f348e','Mark Roman','mark4@email.com',NULL,NULL,'$2b$10$3MGseprisZ2rCtM4DBJy/eRkQyI8zfL/t3433qQr8P.ft9Kt4Ja2S','Mark','Roman',NULL,NULL,NULL,'male',1,NULL,'2025-05-22 03:44:41','2025-05-22 03:44:41'),('d520c74d-c7fa-408d-aa0d-4aa2ed91c681','Mark Nomar','mark2@email.com',NULL,NULL,'$2b$10$8sAsFypS8Rk8zNxELS9p/OHAorwAaNSUEvNiWKIamasqQfcgbscqC','Mark','Nomar',NULL,NULL,NULL,'male',1,NULL,'2025-05-21 08:05:05','2025-05-21 08:05:05'),('e98dbaae-8ebd-4412-b010-c0ddfe7c4f23','Mark Roman','Mark3@email.com',NULL,NULL,'$2b$10$fHM0SeOD93nQbIg9sF8sMuORh0veTdhFIum4d0J5YhrQMmvQzjEkG','Mark','Roman',NULL,NULL,NULL,'male',1,NULL,'2025-05-22 03:34:09','2025-05-22 03:34:09'),('eb040f6e-585c-4cb6-8205-7883d2e00da7','Kram Nomar','mark28@email.com',NULL,NULL,'$2b$10$pffcQvvrvb6drYKElelYe.hdgfrjYESRRIjl5wRU.EMjIv.0SRkza','Kram','Nomar',NULL,NULL,NULL,'male',1,NULL,'2025-05-28 00:27:13','2025-05-28 00:27:13');
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

-- Dump completed on 2025-05-30  2:10:15
