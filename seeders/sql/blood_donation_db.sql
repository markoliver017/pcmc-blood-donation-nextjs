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
  `organization_type` enum('business','media','government','church','education','healthcare','others') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `city_municipality` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL DEFAULT 'Metro Manila',
  `region` varchar(255) NOT NULL DEFAULT 'luzon',
  `remarks` varchar(255) DEFAULT NULL,
  `verified_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `other_organization_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `agencies_name_unique` (`name`),
  KEY `head_id` (`head_id`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `agencies_ibfk_1` FOREIGN KEY (`head_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `agencies_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agencies`
--

LOCK TABLES `agencies` WRITE;
/*!40000 ALTER TABLE `agencies` DISABLE KEYS */;
INSERT INTO `agencies` VALUES (21,'207ac622-41c8-4f4d-948d-419bd6c0a795','http://10.0.0.185:5000/uploads/agency-reg-1750128326862.jpg','Agency Prime','9663603173','Agency Prime Building','Bagong Silang','','activated','education','2025-06-01 23:54:56','2025-06-17 02:45:27','City of Mandaluyong','Metro Manila','luzon',NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795','207ac622-41c8-4f4d-948d-419bd6c0a795',NULL),(32,'b10b971a-ad59-4cc0-bde2-65136c3c37ac',NULL,'Metz and Sons','833-822-2220 x2075','167 Heather Close','Devyn Trafficway',NULL,'activated','government','2025-06-02 23:28:11','2025-06-03 03:28:25','Rodriguezworth','Metro Manila','luzon',NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795',NULL,NULL),(33,'7838dca3-13bd-41f0-9bf1-ef6707436ea2',NULL,'Jacobson Inc','1-703-377-7107','633 Gusikowski Knolls','Keebler Mountain',NULL,'activated','church','2025-06-02 23:28:11','2025-06-22 23:55:20','North Benedict','Metro Manila','luzon',NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795',NULL,NULL),(34,'b10b971a-ad59-4cc0-bde2-65136c3c37ac',NULL,'Bailey - Torphy','621-408-2382 x744','829 Rosenbaum Path','George Street',NULL,'activated','healthcare','2025-06-02 23:28:11','2025-06-22 23:55:59','New Lacyview','Metro Manila','luzon',NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795',NULL,NULL),(35,'866c0cc2-a888-46e7-b619-c3fa3c337c0f',NULL,'Hegmann Inc','470.930.5889 x88763','235 E Elm Street','George Gateway',NULL,'activated','healthcare','2025-06-02 23:28:11','2025-06-02 23:28:11','Bernierbury','Metro Manila','luzon',NULL,NULL,NULL,NULL),(36,'806e519a-8b1d-4176-854a-68394bd84d09',NULL,'Kuhic LLC','(875) 711-9390','1045 Commerce Street','Chestnut Grove',NULL,'rejected','healthcare','2025-06-02 23:28:11','2025-06-23 00:01:17','West Haven','Metro Manila','luzon','I dont want you to be part of my agencies\n','207ac622-41c8-4f4d-948d-419bd6c0a795',NULL,NULL),(37,'7838dca3-13bd-41f0-9bf1-ef6707436ea2',NULL,'Romaguera, Considine and McKenzie','1-981-347-2677 x40041','41044 Ruecker Spring','Rylee Green',NULL,'rejected','church','2025-06-02 23:28:11','2025-06-24 05:59:45','Fort Melyssa','Metro Manila','luzon','naahhh','207ac622-41c8-4f4d-948d-419bd6c0a795',NULL,NULL),(38,'62e044f9-97b9-42e0-b1f9-504f0530713f',NULL,'Ruecker, Emard and Keeling','259-909-4454 x5812','272 W North Street','15th Street',NULL,'for approval','healthcare','2025-06-02 23:28:11','2025-06-02 23:28:11','Gulfport','Metro Manila','luzon',NULL,NULL,NULL,NULL),(39,'b10b971a-ad59-4cc0-bde2-65136c3c37ac',NULL,'Reilly, Towne and Doyle','452-537-1340 x7850','35071 Aida River','Rau Pine',NULL,'for approval','business','2025-06-02 23:28:11','2025-06-02 23:28:11','Memphis','Metro Manila','luzon',NULL,NULL,NULL,NULL),(40,'b10b971a-ad59-4cc0-bde2-65136c3c37ac',NULL,'Gutkowski LLC','362-301-3729','541 O\'Conner Knolls','Doyle Rapids',NULL,'activated','business','2025-06-02 23:28:11','2025-06-24 05:58:57','Beahanview','Metro Manila','luzon',NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795',NULL,NULL),(41,'806e519a-8b1d-4176-854a-68394bd84d09',NULL,'Schiller and Sons','789.460.4938 x287','5517 Breana Fords','Wade Place',NULL,'for approval','education','2025-06-02 23:28:11','2025-06-02 23:28:11','Vidalchester','Metro Manila','luzon',NULL,NULL,NULL,NULL),(42,'6fc5f16a-5da6-4e94-85b8-20b20569c5f5',NULL,'Toyo','9663603172','PCMC Building','Concepcion Uno','Organizer comments','for approval','government','2025-06-11 05:01:30','2025-06-11 05:01:30','City of Marikina','Metro Manila','luzon',NULL,NULL,NULL,NULL),(43,'af2f4108-7d04-46ea-ae8b-e86a07d3a1e8','http://10.0.0.185:5000/uploads/bagong-pilipinas-logo-1750646241646.png','Agency One','912312312','AGency One BUIlding','Rivera','','activated','government','2025-06-23 02:37:21','2025-06-24 05:57:56','City of San Juan','Metro Manila','luzon',NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795',NULL,NULL),(44,'95d748e8-9887-47e3-ae60-8630dbef0b9c',NULL,'Agency threee','9663603171','Building Three','Bagong Silang','My message three','activated','others','2025-06-24 00:25:04','2025-06-24 06:16:34','City of Mandaluyong','Metro Manila','luzon',NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795',NULL,'Games'),(45,'97d39810-9543-4029-8da0-1f1cd56884fc',NULL,'Agency Five','9556656565','Building Five','Barangka Ilaya','Agency Five Message','for approval','others','2025-06-24 05:20:19','2025-06-24 05:20:19','City of Mandaluyong','Metro Manila','luzon',NULL,NULL,NULL,'IBa to'),(47,'4f1bac96-6b45-4512-bc55-8755107c22ea',NULL,'Prime Agency','9656565655','Agency Prime Building','Bambang','','for approval','government','2025-06-26 03:22:30','2025-06-26 03:22:30','City of Pasig','Metro Manila','luzon',NULL,NULL,NULL,'');
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
  `status` enum('for approval','activated','deactivated','rejected') NOT NULL DEFAULT 'for approval',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `comments` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `verified_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `agency_id` (`agency_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `agency_coordinators_ibfk_197` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `agency_coordinators_ibfk_198` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agency_coordinators`
--

LOCK TABLES `agency_coordinators` WRITE;
/*!40000 ALTER TABLE `agency_coordinators` DISABLE KEYS */;
INSERT INTO `agency_coordinators` VALUES (6,32,'17f9e6dd-4bc2-403c-915b-ed637e60c051','9123456789','activated','2025-06-03 03:30:48','2025-06-11 05:05:24','Metz message',NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795'),(7,21,'46f600a4-f8c2-4e6f-8bb1-e870caa1f520','9123456789','activated','2025-06-11 06:43:14','2025-06-11 06:45:31','Agency Prime Coordinator',NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795'),(8,21,'414702ce-b343-4c34-8b5a-824b8c911172','9123456789','for approval','2025-06-23 02:54:34','2025-06-23 02:54:34','as',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=303 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_trails`
--

LOCK TABLES `audit_trails` WRITE;
/*!40000 ALTER TABLE `audit_trails` DISABLE KEYS */;
INSERT INTO `audit_trails` VALUES (32,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','CREATE',0,'A new user has been successfully created. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-21 07:55:04','2025-05-21 07:55:04'),(38,'207ac622-41c8-4f4d-948d-419bd6c0a795','AGENCY ACTION','CREATE',0,'A new user role (Agency Administrator) has been successfully added to user ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-22 05:19:32','2025-05-22 05:19:32'),(39,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','CREATE',0,'A new agency has been successfully created. ID#: 14','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-22 05:33:13','2025-05-22 05:33:13'),(40,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','CREATE',0,'A new agency has been successfully created. ID#: 15','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-22 05:34:29','2025-05-22 05:34:29'),(41,'7838dca3-13bd-41f0-9bf1-ef6707436ea2','users','CREATE',0,'A new user has been successfully created. ID#: 7838dca3-13bd-41f0-9bf1-ef6707436ea2.','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 00:39:52','2025-05-23 00:39:52'),(42,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','CREATE',0,'A new user has been successfully created. ID#: b284b85b-cda1-4f98-9804-08563b0a06c9.','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 01:35:48','2025-05-23 01:35:48'),(43,'b284b85b-cda1-4f98-9804-08563b0a06c9','users','UPDATE',0,'User has been successfully updated. ID#: b284b85b-cda1-4f98-9804-08563b0a06c9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 01:54:33','2025-05-23 01:54:33'),(44,'b284b85b-cda1-4f98-9804-08563b0a06c9','users','UPDATE',0,'User has been successfully updated. ID#: b284b85b-cda1-4f98-9804-08563b0a06c9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 01:57:27','2025-05-23 01:57:27'),(45,'b284b85b-cda1-4f98-9804-08563b0a06c9','users','UPDATE',0,'User has been successfully updated. ID#: b284b85b-cda1-4f98-9804-08563b0a06c9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 02:00:20','2025-05-23 02:00:20'),(46,'b284b85b-cda1-4f98-9804-08563b0a06c9','users','UPDATE',0,'User has been successfully updated. ID#: b284b85b-cda1-4f98-9804-08563b0a06c9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 02:15:35','2025-05-23 02:15:35'),(47,'b284b85b-cda1-4f98-9804-08563b0a06c9','users','UPDATE',0,'User has been successfully updated. ID#: b284b85b-cda1-4f98-9804-08563b0a06c9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 02:16:18','2025-05-23 02:16:18'),(48,'b284b85b-cda1-4f98-9804-08563b0a06c9','users','UPDATE',0,'User has been successfully updated. ID#: b284b85b-cda1-4f98-9804-08563b0a06c9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 02:54:53','2025-05-23 02:54:53'),(49,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','UPDATE',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-23 06:13:31','2025-05-23 06:13:31'),(50,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','updateUserBasicInfo',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:01:49','2025-05-27 02:01:49'),(51,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','updateUserBasicInfo',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:02:26','2025-05-27 02:02:26'),(52,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','UPDATE',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:08:45','2025-05-27 02:08:45'),(53,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','UPDATE',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:28:45','2025-05-27 02:28:45'),(54,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','UPDATE',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:33:15','2025-05-27 02:33:15'),(55,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','UPDATE',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:42:24','2025-05-27 02:42:24'),(56,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','UPDATE',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:42:28','2025-05-27 02:42:28'),(57,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','UPDATE',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:43:38','2025-05-27 02:43:38'),(58,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','UPDATE',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',NULL,'2025-05-27 02:44:11','2025-05-27 02:44:11'),(59,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 11','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0',NULL,'2025-05-27 06:15:30','2025-05-27 06:15:30'),(60,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 15','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0',NULL,'2025-05-27 06:18:08','2025-05-27 06:18:08'),(61,'eb040f6e-585c-4cb6-8205-7883d2e00da7','users','CREATE',0,'A new user has been successfully created. ID#: eb040f6e-585c-4cb6-8205-7883d2e00da7.','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-05-28 00:27:13','2025-05-28 00:27:13'),(62,'62e044f9-97b9-42e0-b1f9-504f0530713f','agencies','CREATE',0,'A new agency has been successfully created. Agency ID#: 17 with User account: 62e044f9-97b9-42e0-b1f9-504f0530713f','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-05-30 00:06:44','2025-05-30 00:06:44'),(63,'806e519a-8b1d-4176-854a-68394bd84d09','agencies','CREATE',0,'A new agency has been successfully created. Agency ID#: 18 with User account: 806e519a-8b1d-4176-854a-68394bd84d09','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-05-30 00:09:14','2025-05-30 00:09:14'),(64,'b10b971a-ad59-4cc0-bde2-65136c3c37ac','agencies','CREATE',0,'A new agency has been successfully created. Agency ID#: 20 with User account: b10b971a-ad59-4cc0-bde2-65136c3c37ac','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-05-30 00:53:28','2025-05-30 00:53:28'),(65,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 17','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-05-30 00:54:37','2025-05-30 00:54:37'),(66,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 18','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-05-30 00:54:41','2025-05-30 00:54:41'),(67,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 20','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-05-30 00:54:46','2025-05-30 00:54:46'),(68,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','agencies','CREATE',0,'A new donor has been successfully created. Donor ID#: 1 with User account: 866c0cc2-a888-46e7-b619-c3fa3c337c0f','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-05-30 07:58:12','2025-05-30 07:58:12'),(69,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','CREATE',0,'A new agency has been successfully created. ID#: 21','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-01 23:54:56','2025-06-01 23:54:56'),(70,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 21','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-02 00:34:41','2025-06-02 00:34:41'),(71,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 21','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-02 00:36:02','2025-06-02 00:36:02'),(72,'7b9704bc-a663-474d-b8c1-cb5c88679bd9','agencies','storeCoordinator',0,'A new coordinator has been successfully created. Coordinator ID#: 1 with User account: 7b9704bc-a663-474d-b8c1-cb5c88679bd9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-02 02:31:29','2025-06-02 02:31:29'),(76,'0f4dd342-9793-4eef-8322-307ed4e6b89e','agencies','storeCoordinator',0,'A new coordinator has been successfully created. Coordinator ID#: 5 with User account: 0f4dd342-9793-4eef-8322-307ed4e6b89e','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-02 02:46:30','2025-06-02 02:46:30'),(77,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE COORDINATOR STATUS',0,'Coordinator status has been successfully updated. ID#: 5','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-02 23:57:18','2025-06-02 23:57:18'),(78,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE COORDINATOR STATUS',0,'Coordinator status has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-03 00:03:05','2025-06-03 00:03:05'),(79,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE COORDINATOR STATUS',0,'Coordinator status has been successfully updated. ID#: 5','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-03 00:04:08','2025-06-03 00:04:08'),(80,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE COORDINATOR STATUS',0,'Coordinator status has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-03 00:50:40','2025-06-03 00:50:40'),(81,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 32','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-03 03:28:25','2025-06-03 03:28:25'),(82,'17f9e6dd-4bc2-403c-915b-ed637e60c051','agencies','storeCoordinator',0,'A new coordinator has been successfully created. Coordinator ID#: 6 with User account: 17f9e6dd-4bc2-403c-915b-ed637e60c051','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-03 03:30:48','2025-06-03 03:30:48'),(83,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE COORDINATOR STATUS',0,'Coordinator status has been successfully updated. ID#: 5','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-03 04:00:27','2025-06-03 04:00:27'),(84,'207ac622-41c8-4f4d-948d-419bd6c0a795','donors','UPDATE DONOR STATUS',0,'The Donor status has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-03 07:27:47','2025-06-03 07:27:47'),(85,'207ac622-41c8-4f4d-948d-419bd6c0a795','donors','UPDATE DONOR STATUS',0,'The Donor status has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-03 07:31:47','2025-06-03 07:31:47'),(86,'207ac622-41c8-4f4d-948d-419bd6c0a795','donors','UPDATE DONOR STATUS',0,'The Donor status has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-03 23:27:19','2025-06-03 23:27:19'),(87,'62e044f9-97b9-42e0-b1f9-504f0530713f','donors','UPDATE DONOR STATUS',0,'The Donor status has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-04 00:05:04','2025-06-04 00:05:04'),(88,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','updateUserBasicInfo',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-04 01:27:16','2025-06-04 01:27:16'),(89,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE',0,'Agency has been successfully updated. ID#: 21','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-04 07:39:48','2025-06-04 07:39:48'),(90,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE',0,'Agency has been successfully updated. ID#: 21','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-04 07:40:22','2025-06-04 07:40:22'),(91,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE',0,'Agency has been successfully updated. ID#: 21','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-04 07:40:53','2025-06-04 07:40:53'),(92,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE',0,'Agency has been successfully updated. ID#: 21','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-04 07:47:36','2025-06-04 07:47:36'),(93,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE',0,'Agency has been successfully updated. ID#: 21','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-04 07:48:35','2025-06-04 07:48:35'),(94,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','updateUserBasicInfo',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-04 07:48:47','2025-06-04 07:48:47'),(95,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','updateUserBasicInfo',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-04 07:49:50','2025-06-04 07:49:50'),(96,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE',0,'Agency has been successfully updated. ID#: 21','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-04 07:50:01','2025-06-04 07:50:01'),(97,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','UPDATE',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-04 07:50:15','2025-06-04 07:50:15'),(98,'354043dd-2394-42a6-8b7f-3e954d5835ce','agencies','CREATE',0,'A new donor has been successfully created. Donor ID#: 2 with User account: 354043dd-2394-42a6-8b7f-3e954d5835ce','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-04 23:30:22','2025-06-04 23:30:22'),(99,'207ac622-41c8-4f4d-948d-419bd6c0a795','donors','UPDATE DONOR STATUS',0,'The Donor status has been successfully updated. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-04 23:32:36','2025-06-04 23:32:36'),(100,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE',0,'Agency has been successfully updated. ID#: 21','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0',NULL,'2025-06-04 23:42:06','2025-06-04 23:42:06'),(101,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE',0,'Agency has been successfully updated. ID#: 21','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0',NULL,'2025-06-04 23:42:50','2025-06-04 23:42:50'),(102,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE',0,'Agency has been successfully updated. ID#: 21','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0',NULL,'2025-06-04 23:43:54','2025-06-04 23:43:54'),(103,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE',0,'Agency has been successfully updated. ID#: 21','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0',NULL,'2025-06-05 00:09:17','2025-06-05 00:09:17'),(104,'c03662e1-5291-481d-9bd0-ad9f785db339','agencies','CREATE',0,'A new donor has been successfully created. Donor ID#: 3 with User account: c03662e1-5291-481d-9bd0-ad9f785db339','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0',NULL,'2025-06-05 00:49:37','2025-06-05 00:49:37'),(105,'5515d7d1-c832-4835-92c8-8570815a838d','agencies','CREATE',0,'A new donor has been successfully created. Donor ID#: 4 with User account: 5515d7d1-c832-4835-92c8-8570815a838d','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0',NULL,'2025-06-05 00:53:04','2025-06-05 00:53:04'),(106,'354043dd-2394-42a6-8b7f-3e954d5835ce','donors','UPDATE DONOR',0,'The Donor\'s profile has been successfully updated. ID#: 2','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-05 03:01:06','2025-06-05 03:01:06'),(107,'354043dd-2394-42a6-8b7f-3e954d5835ce','donors','UPDATE DONOR',0,'The Donor\'s profile has been successfully updated. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-05 03:01:25','2025-06-05 03:01:25'),(108,'354043dd-2394-42a6-8b7f-3e954d5835ce','donors','UPDATE DONOR',0,'The Donor\'s profile has been successfully updated. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-05 03:02:04','2025-06-05 03:02:04'),(109,'354043dd-2394-42a6-8b7f-3e954d5835ce','donors','UPDATE DONOR BLOOD TYPE',0,'The Donor\'s blood type has been successfully updated. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-05 03:32:36','2025-06-05 03:32:36'),(110,'354043dd-2394-42a6-8b7f-3e954d5835ce','donors','UPDATE DONOR BLOOD TYPE',0,'The Donor\'s blood type has been successfully updated. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-05 03:32:47','2025-06-05 03:32:47'),(111,'354043dd-2394-42a6-8b7f-3e954d5835ce','donors','UPDATE DONOR BLOOD TYPE',0,'The Donor\'s blood type has been successfully updated. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-05 03:32:54','2025-06-05 03:32:54'),(112,'354043dd-2394-42a6-8b7f-3e954d5835ce','donors','UPDATE DONOR BLOOD TYPE',0,'The Donor\'s blood type has been successfully updated. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-05 03:33:01','2025-06-05 03:33:01'),(113,'354043dd-2394-42a6-8b7f-3e954d5835ce','donors','UPDATE DONOR BLOOD TYPE',0,'The Donor\'s blood type has been successfully updated. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-05 03:33:07','2025-06-05 03:33:07'),(114,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 3','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-10 02:52:26','2025-06-10 02:52:26'),(115,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 4','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-10 02:54:48','2025-06-10 02:54:48'),(116,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 5','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-10 02:55:49','2025-06-10 02:55:49'),(117,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 6','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-10 02:59:51','2025-06-10 02:59:51'),(118,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 7','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-10 03:03:22','2025-06-10 03:03:22'),(119,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 8','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-10 03:29:47','2025-06-10 03:29:47'),(120,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-10 03:31:21','2025-06-10 03:31:21'),(121,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 10','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-10 04:31:01','2025-06-10 04:31:01'),(122,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 11','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-10 04:31:55','2025-06-10 04:31:55'),(123,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 12','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-10 05:25:45','2025-06-10 05:25:45'),(124,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 13','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-10 07:59:32','2025-06-10 07:59:32'),(125,'207ac622-41c8-4f4d-948d-419bd6c0a795','adminEventAction','UPDATE EVENT STATUS',0,'Event status has been successfully updated. ID#: 10','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-11 02:18:49','2025-06-11 02:18:49'),(126,'207ac622-41c8-4f4d-948d-419bd6c0a795','adminEventAction','UPDATE EVENT STATUS',0,'Event status has been successfully updated. ID#: 11','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-11 02:40:28','2025-06-11 02:40:28'),(127,'207ac622-41c8-4f4d-948d-419bd6c0a795','adminEventAction','UPDATE EVENT STATUS',0,'Event status has been successfully updated. ID#: 12','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-11 02:42:00','2025-06-11 02:42:00'),(128,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 13','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-11 02:44:54','2025-06-11 02:44:54'),(129,'207ac622-41c8-4f4d-948d-419bd6c0a795','adminEventAction','UPDATE EVENT STATUS',0,'Event status has been successfully updated. ID#: 13','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-11 02:45:26','2025-06-11 02:45:26'),(130,'6fc5f16a-5da6-4e94-85b8-20b20569c5f5','agencies','CREATE',0,'A new agency has been successfully created. Agency ID#: 42 with User account: 6fc5f16a-5da6-4e94-85b8-20b20569c5f5','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-11 05:01:30','2025-06-11 05:01:30'),(131,'8c4cafef-4acb-408d-8637-4c05e1549f17','agencies','CREATE',0,'A new donor has been successfully created. Donor ID#: 5 with User account: 8c4cafef-4acb-408d-8637-4c05e1549f17','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-11 05:03:30','2025-06-11 05:03:30'),(132,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE COORDINATOR STATUS',0,'Coordinator status has been successfully updated. ID#: 6','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-11 05:05:24','2025-06-11 05:05:24'),(133,'17f9e6dd-4bc2-403c-915b-ed637e60c051','donors','UPDATE DONOR STATUS',0,'The Donor status has been successfully updated. ID#: 5','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-11 05:29:08','2025-06-11 05:29:08'),(134,'207ac622-41c8-4f4d-948d-419bd6c0a795','donors','UPDATE DONOR STATUS',0,'The Donor status has been successfully updated. ID#: 3','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-11 06:05:59','2025-06-11 06:05:59'),(135,'207ac622-41c8-4f4d-948d-419bd6c0a795','donors','UPDATE DONOR STATUS',0,'The Donor status has been successfully updated. ID#: 4','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-11 06:06:03','2025-06-11 06:06:03'),(136,'46f600a4-f8c2-4e6f-8bb1-e870caa1f520','agencies','storeCoordinator',0,'A new coordinator has been successfully created. Coordinator ID#: 7 with User account: 46f600a4-f8c2-4e6f-8bb1-e870caa1f520','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-11 06:43:14','2025-06-11 06:43:14'),(137,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE COORDINATOR STATUS',0,'Coordinator status has been successfully updated. ID#: 7','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-11 06:45:31','2025-06-11 06:45:31'),(138,'46f600a4-f8c2-4e6f-8bb1-e870caa1f520','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 14','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-11 06:52:01','2025-06-11 06:52:01'),(139,'46f600a4-f8c2-4e6f-8bb1-e870caa1f520','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 14','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-11 07:09:02','2025-06-11 07:09:02'),(140,'207ac622-41c8-4f4d-948d-419bd6c0a795','adminEventAction','UPDATE EVENT STATUS',0,'Event status has been successfully updated. ID#: 14','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-11 07:15:27','2025-06-11 07:15:27'),(141,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 15','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-13 05:36:27','2025-06-13 05:36:27'),(142,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 16','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-13 05:37:27','2025-06-13 05:37:27'),(143,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 15','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-13 05:55:49','2025-06-13 05:55:49'),(144,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 15','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-13 05:56:21','2025-06-13 05:56:21'),(145,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 11','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-13 06:03:33','2025-06-13 06:03:33'),(146,'207ac622-41c8-4f4d-948d-419bd6c0a795','adminEventAction','UPDATE EVENT STATUS',0,'Event status has been successfully updated. ID#: 11','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-13 06:07:21','2025-06-13 06:07:21'),(147,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-13 07:09:55','2025-06-13 07:09:55'),(148,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-13 07:20:01','2025-06-13 07:20:01'),(149,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 3','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-13 07:21:46','2025-06-13 07:21:46'),(150,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 4','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-13 07:22:10','2025-06-13 07:22:10'),(151,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 5','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-16 00:17:28','2025-06-16 00:17:28'),(152,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 6','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-16 00:17:57','2025-06-16 00:17:57'),(153,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 7','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-16 00:34:52','2025-06-16 00:34:52'),(154,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 8','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-16 00:37:33','2025-06-16 00:37:33'),(155,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 9','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-16 00:39:23','2025-06-16 00:39:23'),(156,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 10','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-16 00:41:14','2025-06-16 00:41:14'),(157,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 11','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-16 00:44:36','2025-06-16 00:44:36'),(158,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 12','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-16 01:00:14','2025-06-16 01:00:14'),(159,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 13','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-16 01:01:14','2025-06-16 01:01:14'),(160,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 14','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-16 01:03:05','2025-06-16 01:03:05'),(161,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 15','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-16 01:03:27','2025-06-16 01:03:27'),(162,'5515d7d1-c832-4835-92c8-8570815a838d','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 5515d7d1-c832-4835-92c8-8570815a838d. ID#: 16','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-16 06:10:34','2025-06-16 06:10:34'),(163,'207ac622-41c8-4f4d-948d-419bd6c0a795','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to closed. ID#: 13','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-16 06:14:46','2025-06-16 06:14:46'),(164,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 13','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-16 06:22:42','2025-06-16 06:22:42'),(165,'5515d7d1-c832-4835-92c8-8570815a838d','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 5515d7d1-c832-4835-92c8-8570815a838d. ID#: 17','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-16 07:36:37','2025-06-16 07:36:37'),(167,'5515d7d1-c832-4835-92c8-8570815a838d','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 5515d7d1-c832-4835-92c8-8570815a838d. ID#: 18','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-16 07:43:06','2025-06-16 07:43:06'),(168,'13bbd8c8-7df6-45cf-ba79-4a3f55d45620','agencies','CREATE',0,'A new donor has been successfully created. Donor ID#: 6 with User account: 13bbd8c8-7df6-45cf-ba79-4a3f55d45620','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-17 00:33:51','2025-06-17 00:33:51'),(169,'97dfcc89-0f86-4f0b-bd95-784532d8a1b4','agencies','CREATE',0,'A new donor has been successfully created. Donor ID#: 7 with User account: 97dfcc89-0f86-4f0b-bd95-784532d8a1b4','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-17 01:07:58','2025-06-17 01:07:58'),(170,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE',0,'Agency has been successfully updated. ID#: 21','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-17 02:45:27','2025-06-17 02:45:27'),(171,'207ac622-41c8-4f4d-948d-419bd6c0a795','adminEventAction','UPDATE EVENT STATUS',0,'Event status has been successfully updated. ID#: 15','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-17 06:57:10','2025-06-17 06:57:10'),(176,'207ac622-41c8-4f4d-948d-419bd6c0a795','users','updateUserBasicInfo',0,'User has been successfully updated. ID#: 207ac622-41c8-4f4d-948d-419bd6c0a795','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-18 00:36:21','2025-06-18 00:36:21'),(177,'354043dd-2394-42a6-8b7f-3e954d5835ce','users','updateUserBasicInfo',0,'User has been successfully updated. ID#: 354043dd-2394-42a6-8b7f-3e954d5835ce','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-18 00:36:46','2025-06-18 00:36:46'),(178,'354043dd-2394-42a6-8b7f-3e954d5835ce','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 354043dd-2394-42a6-8b7f-3e954d5835ce. ID#: 19','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-18 01:59:31','2025-06-18 01:59:31'),(179,'354043dd-2394-42a6-8b7f-3e954d5835ce','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 354043dd-2394-42a6-8b7f-3e954d5835ce. ID#: 20','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-18 01:59:36','2025-06-18 01:59:36'),(180,'207ac622-41c8-4f4d-948d-419bd6c0a795','donors','UPDATE DONOR STATUS',0,'The Donor status has been successfully updated. ID#: 6','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-19 01:24:57','2025-06-19 01:24:57'),(181,'354043dd-2394-42a6-8b7f-3e954d5835ce','donors','UPDATE DONOR BLOOD TYPE',0,'The Donor\'s blood type has been successfully updated. ID#: 2','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-19 02:14:32','2025-06-19 02:14:32'),(182,'207ac622-41c8-4f4d-948d-419bd6c0a795','donors','UPDATE DONOR BLOOD TYPE',0,'The Donor\'s blood type has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-19 02:16:28','2025-06-19 02:16:28'),(183,'207ac622-41c8-4f4d-948d-419bd6c0a795','donors','UPDATE DONOR BLOOD TYPE',0,'The Donor\'s blood type has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-19 02:18:28','2025-06-19 02:18:28'),(184,'207ac622-41c8-4f4d-948d-419bd6c0a795','donors','UPDATE DONOR BLOOD TYPE',0,'The Donor\'s blood type has been successfully updated. ID#: 4','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-19 02:28:55','2025-06-19 02:28:55'),(185,'207ac622-41c8-4f4d-948d-419bd6c0a795','donors','UPDATE DONOR BLOOD TYPE',0,'The Donor\'s blood type has been successfully updated. ID#: 2','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-19 02:32:36','2025-06-19 02:32:36'),(186,'c03662e1-5291-481d-9bd0-ad9f785db339','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: c03662e1-5291-481d-9bd0-ad9f785db339. ID#: 21','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-19 02:40:56','2025-06-19 02:40:56'),(187,'c03662e1-5291-481d-9bd0-ad9f785db339','donors','UPDATE DONOR BLOOD TYPE',0,'The Donor\'s blood type has been successfully updated. ID#: 3','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-19 02:44:47','2025-06-19 02:44:47'),(188,'207ac622-41c8-4f4d-948d-419bd6c0a795','donors','UPDATE USERDONOR',0,'The Donor\'s profile has been successfully verified. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-19 03:03:28','2025-06-19 03:03:28'),(189,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 22','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-19 05:35:12','2025-06-19 05:35:12'),(190,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 23','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-19 05:35:43','2025-06-19 05:35:43'),(191,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 24','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-19 07:05:54','2025-06-19 07:05:54'),(192,'866c0cc2-a888-46e7-b619-c3fa3c337c0f','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 866c0cc2-a888-46e7-b619-c3fa3c337c0f. ID#: 25','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-19 07:22:14','2025-06-19 07:22:14'),(193,'207ac622-41c8-4f4d-948d-419bd6c0a795','donorAppointmentAction','donorAppointmentDetails',0,'The Donor\'s appointment details has been successfully updated. ID#: 18','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-20 06:15:02','2025-06-20 06:15:02'),(194,'207ac622-41c8-4f4d-948d-419bd6c0a795','donorAppointmentAction','donorAppointmentDetails',0,'The Donor\'s appointment details has been successfully updated. ID#: 18','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-20 06:15:33','2025-06-20 06:15:33'),(195,'207ac622-41c8-4f4d-948d-419bd6c0a795','donorAppointmentAction','donorAppointmentDetails',0,'The Donor\'s appointment details has been successfully updated. ID#: 18','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-20 06:15:43','2025-06-20 06:15:43'),(196,'207ac622-41c8-4f4d-948d-419bd6c0a795','donorAppointmentAction','donorAppointmentDetails',0,'The Donor\'s appointment details has been successfully updated. ID#: 18','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-20 06:22:48','2025-06-20 06:22:48'),(197,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 33','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-22 23:55:20','2025-06-22 23:55:20'),(198,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 34','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-22 23:55:59','2025-06-22 23:55:59'),(199,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 36','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-23 00:01:17','2025-06-23 00:01:17'),(200,'46f600a4-f8c2-4e6f-8bb1-e870caa1f520','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 17','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-23 00:07:31','2025-06-23 00:07:31'),(201,'46f600a4-f8c2-4e6f-8bb1-e870caa1f520','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 16','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-23 00:13:02','2025-06-23 00:13:02'),(202,'33715f7b-4059-43fa-a2a8-e32fe6b419f3','agencies','CREATE',0,'A new donor has been successfully created. Donor ID#: 8 with User account: 33715f7b-4059-43fa-a2a8-e32fe6b419f3','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',NULL,'2025-06-23 00:21:51','2025-06-23 00:21:51'),(203,'46f600a4-f8c2-4e6f-8bb1-e870caa1f520','donors','UPDATE DONOR STATUS',0,'The Donor status has been successfully updated. ID#: 7','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-23 00:22:33','2025-06-23 00:22:33'),(204,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 14','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-23 00:36:36','2025-06-23 00:36:36'),(205,'207ac622-41c8-4f4d-948d-419bd6c0a795','physicalExamAction','storeUpdatePhysicalExam ',0,'The Donor\'s physical examination has been successfully submitted. With appointment ID#: 1.','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-23 01:08:02','2025-06-23 01:08:02'),(206,'207ac622-41c8-4f4d-948d-419bd6c0a795','bloodDonationCollectionAction','storeUpdateBloodCollection ',0,'The Donor\'s blood collection data has been successfully updated. With appointment ID#: 1.','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-23 01:08:24','2025-06-23 01:08:24'),(207,'207ac622-41c8-4f4d-948d-419bd6c0a795','physicalExamAction','storeUpdatePhysicalExam ',0,'The Donor\'s physical examination has been successfully submitted. With appointment ID#: 25.','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-23 01:28:20','2025-06-23 01:28:20'),(208,'207ac622-41c8-4f4d-948d-419bd6c0a795','bloodDonationCollectionAction','storeUpdateBloodCollection ',0,'The Donor\'s blood collection data has been successfully updated. With appointment ID#: 25.','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-23 01:28:29','2025-06-23 01:28:29'),(209,'af2f4108-7d04-46ea-ae8b-e86a07d3a1e8','agencies','CREATE',0,'A new agency has been successfully created. Agency ID#: 43 with User account: af2f4108-7d04-46ea-ae8b-e86a07d3a1e8','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-23 02:37:21','2025-06-23 02:37:21'),(210,'414702ce-b343-4c34-8b5a-824b8c911172','agencies','storeCoordinator',0,'A new coordinator has been successfully created. Coordinator ID#: 8 with User account: 414702ce-b343-4c34-8b5a-824b8c911172','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',NULL,'2025-06-23 02:54:34','2025-06-23 02:54:34'),(211,'207ac622-41c8-4f4d-948d-419bd6c0a795','donors','UPDATE USERDONOR',0,'The Donor\'s profile has been successfully verified. ID#: 4','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-23 03:01:02','2025-06-23 03:01:02'),(212,'207ac622-41c8-4f4d-948d-419bd6c0a795','donors','UPDATE DONOR BLOOD TYPE',0,'The Donor\'s blood type has been successfully updated. ID#: 3','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-23 03:02:47','2025-06-23 03:02:47'),(213,'207ac622-41c8-4f4d-948d-419bd6c0a795','physicalExamAction','storeUpdatePhysicalExam ',0,'The Donor\'s physical examination has been successfully submitted. With appointment ID#: 1.','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-23 03:21:27','2025-06-23 03:21:27'),(214,'207ac622-41c8-4f4d-948d-419bd6c0a795','physicalExamAction','storeUpdatePhysicalExam ',0,'The Donor\'s physical examination has been successfully submitted. With appointment ID#: 1.','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-23 03:21:42','2025-06-23 03:21:42'),(215,'95d748e8-9887-47e3-ae60-8630dbef0b9c','agencies','CREATE',0,'A new agency has been successfully created. Agency ID#: 44 with User account: 95d748e8-9887-47e3-ae60-8630dbef0b9c','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-24 00:25:04','2025-06-24 00:25:04'),(216,'97d39810-9543-4029-8da0-1f1cd56884fc','agencies','CREATE',0,'A new agency has been successfully created. Agency ID#: 45 with User account: 97d39810-9543-4029-8da0-1f1cd56884fc','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-24 05:20:23','2025-06-24 05:20:23'),(217,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 43','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-24 05:57:57','2025-06-24 05:57:57'),(218,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 40','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-24 05:58:57','2025-06-24 05:58:57'),(219,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 37','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-24 05:59:46','2025-06-24 05:59:46'),(220,'207ac622-41c8-4f4d-948d-419bd6c0a795','agencies','UPDATE AGENCY STATUS',0,'User status has been successfully updated. ID#: 44','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-24 06:16:34','2025-06-24 06:16:34'),(221,'b10b971a-ad59-4cc0-bde2-65136c3c37ac','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 18','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-25 02:04:57','2025-06-25 02:04:57'),(222,'b10b971a-ad59-4cc0-bde2-65136c3c37ac','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 19','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-25 02:10:05','2025-06-25 02:10:05'),(223,'b10b971a-ad59-4cc0-bde2-65136c3c37ac','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 20','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-25 02:12:11','2025-06-25 02:12:11'),(224,'b10b971a-ad59-4cc0-bde2-65136c3c37ac','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 21','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-25 02:14:16','2025-06-25 02:14:16'),(225,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 22','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',NULL,'2025-06-25 06:29:31','2025-06-25 06:29:31'),(226,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:08:52','2025-06-26 00:08:52'),(227,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 24','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:13:08','2025-06-26 00:13:08'),(228,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','STORE EVENT',0,'New blood donation event has been successfully created. ID#: 25','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:14:26','2025-06-26 00:14:26'),(229,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:29:54','2025-06-26 00:29:54'),(230,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:29:55','2025-06-26 00:29:55'),(231,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:30:08','2025-06-26 00:30:08'),(232,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:30:13','2025-06-26 00:30:13'),(233,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:30:16','2025-06-26 00:30:16'),(234,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:30:25','2025-06-26 00:30:25'),(235,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:30:50','2025-06-26 00:30:50'),(236,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:32:40','2025-06-26 00:32:40'),(237,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:32:48','2025-06-26 00:32:48'),(238,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:33:36','2025-06-26 00:33:36'),(239,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:33:37','2025-06-26 00:33:37'),(240,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:33:43','2025-06-26 00:33:43'),(241,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:37:39','2025-06-26 00:37:39'),(242,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:39:00','2025-06-26 00:39:00'),(243,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:39:13','2025-06-26 00:39:13'),(244,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:39:14','2025-06-26 00:39:14'),(245,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:39:40','2025-06-26 00:39:40'),(246,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:40:20','2025-06-26 00:40:20'),(247,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:40:50','2025-06-26 00:40:50'),(248,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:41:52','2025-06-26 00:41:52'),(249,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:41:57','2025-06-26 00:41:57'),(250,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:42:00','2025-06-26 00:42:00'),(251,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:42:01','2025-06-26 00:42:01'),(252,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:42:02','2025-06-26 00:42:02'),(253,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:42:03','2025-06-26 00:42:03'),(254,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:42:19','2025-06-26 00:42:19'),(255,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:42:26','2025-06-26 00:42:26'),(256,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:43:11','2025-06-26 00:43:11'),(257,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:43:13','2025-06-26 00:43:13'),(258,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:43:16','2025-06-26 00:43:16'),(259,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:43:17','2025-06-26 00:43:17'),(260,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:43:19','2025-06-26 00:43:19'),(261,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:43:24','2025-06-26 00:43:24'),(262,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:43:24','2025-06-26 00:43:24'),(263,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:43:28','2025-06-26 00:43:28'),(264,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:43:30','2025-06-26 00:43:30'),(265,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:43:38','2025-06-26 00:43:38'),(266,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:43:39','2025-06-26 00:43:39'),(267,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:43:42','2025-06-26 00:43:42'),(268,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:43:43','2025-06-26 00:43:43'),(269,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:43:44','2025-06-26 00:43:44'),(270,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:43:45','2025-06-26 00:43:45'),(271,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:43:46','2025-06-26 00:43:46'),(272,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:43:51','2025-06-26 00:43:51'),(273,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:44:33','2025-06-26 00:44:33'),(274,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:44:40','2025-06-26 00:44:40'),(275,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:44:47','2025-06-26 00:44:47'),(276,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:44:50','2025-06-26 00:44:50'),(277,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:44:55','2025-06-26 00:44:55'),(278,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:44:57','2025-06-26 00:44:57'),(279,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:46:20','2025-06-26 00:46:20'),(280,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:46:37','2025-06-26 00:46:37'),(281,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:48:27','2025-06-26 00:48:27'),(282,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 00:52:00','2025-06-26 00:52:00'),(283,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 01:00:15','2025-06-26 01:00:15'),(284,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 01:00:46','2025-06-26 01:00:46'),(285,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 01:00:48','2025-06-26 01:00:48'),(286,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 01:01:05','2025-06-26 01:01:05'),(287,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 01:09:56','2025-06-26 01:09:56'),(288,'4f1bac96-6b45-4512-bc55-8755107c22ea','agencies','CREATE',0,'A new agency has been successfully created. Agency ID#: 47 with User account: 4f1bac96-6b45-4512-bc55-8755107c22ea','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 03:22:36','2025-06-26 03:22:36'),(289,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 05:47:07','2025-06-26 05:47:07'),(290,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 05:47:08','2025-06-26 05:47:08'),(291,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 05:47:09','2025-06-26 05:47:09'),(292,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT TIME SCHEDULE',0,'Blood donation time schedule has been successfully updated. ID#: 1','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 06:00:15','2025-06-26 06:00:15'),(293,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 06:00:23','2025-06-26 06:00:23'),(294,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 06:00:31','2025-06-26 06:00:31'),(295,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 06:00:31','2025-06-26 06:00:31'),(296,'207ac622-41c8-4f4d-948d-419bd6c0a795','events','UPDATE EVENT',0,'Blood donation event has been successfully updated. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 06:00:35','2025-06-26 06:00:35'),(297,'207ac622-41c8-4f4d-948d-419bd6c0a795','adminEventAction','UPDATE EVENT STATUS',0,'Event status has been successfully updated. ID#: 23','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 06:18:47','2025-06-26 06:18:47'),(298,'207ac622-41c8-4f4d-948d-419bd6c0a795','adminEventAction','UPDATE EVENT REGISTRATION STATUS',0,'The Event registration status has been successfully updated to ongoing. ID#: 23','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',NULL,'2025-06-26 06:47:15','2025-06-26 06:47:15'),(299,'354043dd-2394-42a6-8b7f-3e954d5835ce','donorAppointmentAction','BOOK DONOR APPOINTMENT',0,'New appointment has been successfully booked to User ID: 354043dd-2394-42a6-8b7f-3e954d5835ce. ID#: 26','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 23:18:07','2025-06-26 23:18:07'),(300,'207ac622-41c8-4f4d-948d-419bd6c0a795','physicalExamAction','storeUpdatePhysicalExam ',0,'The Donor\'s physical examination has been successfully submitted. With appointment ID#: 26.','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-26 23:28:59','2025-06-26 23:28:59'),(301,'207ac622-41c8-4f4d-948d-419bd6c0a795','physicalExamAction','storeUpdatePhysicalExam ',0,'The Donor\'s physical examination has been successfully submitted. With appointment ID#: 26.','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-27 00:04:18','2025-06-27 00:04:18'),(302,'207ac622-41c8-4f4d-948d-419bd6c0a795','physicalExamAction','storeUpdatePhysicalExam ',0,'The Donor\'s physical examination has been successfully submitted. With appointment ID#: 26.','::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',NULL,'2025-06-27 00:35:39','2025-06-27 00:35:39');
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
  CONSTRAINT `blood_donation_collections_ibfk_81` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `blood_donation_collections_ibfk_82` FOREIGN KEY (`appointment_id`) REFERENCES `donor_appointment_infos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `blood_donation_collections_ibfk_83` FOREIGN KEY (`event_id`) REFERENCES `blood_donation_events` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `blood_donation_collections_ibfk_84` FOREIGN KEY (`physical_examination_id`) REFERENCES `physical_examinations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `blood_donation_collections_ibfk_85` FOREIGN KEY (`collector_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_donation_collections`
--

LOCK TABLES `blood_donation_collections` WRITE;
/*!40000 ALTER TABLE `blood_donation_collections` DISABLE KEYS */;
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
  `remarks` varchar(255) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `status` enum('approved','for approval','cancelled','rejected') NOT NULL DEFAULT 'for approval',
  `registration_status` enum('not started','ongoing','closed','completed') NOT NULL DEFAULT 'not started',
  `is_notified` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `verified_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `agency_id` (`agency_id`),
  KEY `requester_id` (`requester_id`),
  KEY `verified_by` (`verified_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `blood_donation_events_ibfk_301` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `blood_donation_events_ibfk_302` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `blood_donation_events_ibfk_303` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `blood_donation_events_ibfk_304` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_donation_events`
--

LOCK TABLES `blood_donation_events` WRITE;
/*!40000 ALTER TABLE `blood_donation_events` DISABLE KEYS */;
INSERT INTO `blood_donation_events` VALUES (23,21,'207ac622-41c8-4f4d-948d-419bd6c0a795','Event 1 ','<p><span style=\"font-size: 16px\"><em>Event 1 Description update</em></span></p>',NULL,NULL,'approved','ongoing',0,'2025-06-26 00:08:52','2025-06-26 06:47:14','207ac622-41c8-4f4d-948d-419bd6c0a795','207ac622-41c8-4f4d-948d-419bd6c0a795','2025-07-02'),(24,21,'207ac622-41c8-4f4d-948d-419bd6c0a795','Event 2','<p><span style=\"font-size: 24px\"><em>This is a sample description event 2</em></span></p>',NULL,NULL,'for approval','not started',0,'2025-06-26 00:13:08','2025-06-26 00:13:08',NULL,NULL,'2025-09-30'),(25,21,'207ac622-41c8-4f4d-948d-419bd6c0a795','Event 3','<p><span style=\"font-size: 24px\"><em>This is a sample description 3</em></span></p>',NULL,NULL,'for approval','not started',0,'2025-06-26 00:14:26','2025-06-26 00:14:26',NULL,NULL,'2025-12-31');
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
  CONSTRAINT `blood_requests_ibfk_183` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `blood_requests_ibfk_184` FOREIGN KEY (`blood_type_id`) REFERENCES `blood_types` (`id`) ON UPDATE CASCADE
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
  `no_days_before` int NOT NULL DEFAULT '90',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_types`
--

LOCK TABLES `blood_types` WRITE;
/*!40000 ALTER TABLE `blood_types` DISABLE KEYS */;
INSERT INTO `blood_types` VALUES (1,'A +',90),(2,'A -',90),(3,'B +',90),(4,'B -',90),(5,'AB +',90),(6,'AB -',90),(7,'O +',90),(8,'O -',90);
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
  `time_schedule_id` int DEFAULT NULL,
  `event_id` int NOT NULL,
  `donor_type` enum('replacement','volunteer') NOT NULL DEFAULT 'volunteer',
  `patient_name` varchar(255) DEFAULT NULL,
  `relation` varchar(255) DEFAULT NULL,
  `status` enum('registered','cancelled','no show') NOT NULL DEFAULT 'registered',
  `comments` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `collection_method` enum('whole blood','apheresis') NOT NULL DEFAULT 'whole blood',
  PRIMARY KEY (`id`),
  KEY `donor_id` (`donor_id`),
  KEY `time_schedule_id` (`time_schedule_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `donor_appointment_infos_ibfk_133` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `donor_appointment_infos_ibfk_134` FOREIGN KEY (`time_schedule_id`) REFERENCES `event_time_schedules` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `donor_appointment_infos_ibfk_135` FOREIGN KEY (`event_id`) REFERENCES `blood_donation_events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donor_appointment_infos`
--

LOCK TABLES `donor_appointment_infos` WRITE;
/*!40000 ALTER TABLE `donor_appointment_infos` DISABLE KEYS */;
INSERT INTO `donor_appointment_infos` VALUES (26,2,1,23,'volunteer',NULL,NULL,'registered',NULL,'2025-06-26 23:18:07','2025-06-26 23:18:07',NULL,'whole blood');
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
  `civil_status` enum('single','married','divorced','separated','widowed') NOT NULL DEFAULT 'single',
  `contact_number` varchar(15) NOT NULL,
  `nationality` varchar(255) NOT NULL DEFAULT 'Filipino',
  `occupation` varchar(255) DEFAULT NULL,
  `id_url` text,
  `is_regular_donor` tinyint(1) DEFAULT '0',
  `last_donation_date` varchar(255) DEFAULT NULL,
  `blood_service_facility` varchar(255) DEFAULT NULL,
  `address` text NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `city_municipality` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL DEFAULT 'Metro Manila',
  `region` varchar(255) NOT NULL DEFAULT 'luzon',
  `comments` text,
  `status` enum('for approval','activated','deactivated','rejected') NOT NULL DEFAULT 'for approval',
  `is_data_verified` tinyint(1) DEFAULT '0',
  `data_verified_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_bloodtype_verified` tinyint(1) DEFAULT '0',
  `bloodtype_verified_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `verified_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `last_donation_event_id` int DEFAULT NULL,
  `last_donation_examination_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `agency_id` (`agency_id`),
  KEY `user_id` (`user_id`),
  KEY `blood_type_id` (`blood_type_id`),
  KEY `verified_by` (`verified_by`),
  KEY `last_donation_event_id` (`last_donation_event_id`),
  KEY `last_donation_examination_id` (`last_donation_examination_id`),
  CONSTRAINT `donors_ibfk_393` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `donors_ibfk_394` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `donors_ibfk_395` FOREIGN KEY (`blood_type_id`) REFERENCES `blood_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `donors_ibfk_396` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `donors_ibfk_397` FOREIGN KEY (`last_donation_event_id`) REFERENCES `blood_donation_events` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `donors_ibfk_398` FOREIGN KEY (`last_donation_examination_id`) REFERENCES `physical_examinations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donors`
--

LOCK TABLES `donors` WRITE;
/*!40000 ALTER TABLE `donors` DISABLE KEYS */;
INSERT INTO `donors` VALUES (1,21,'866c0cc2-a888-46e7-b619-c3fa3c337c0f',1,'1993-04-23','married','+639663603172','Filipino','Welder','http://10.0.0.185:5000/uploads/default-id-1749084782527.jpg',1,'2023-04-23','Hospital','#1 Bonifacio Street','Barangka Drive','City of Mandaluyong','Metro Manila','luzon','This is a sample message','activated',1,NULL,1,NULL,'62e044f9-97b9-42e0-b1f9-504f0530713f','207ac622-41c8-4f4d-948d-419bd6c0a795','2025-05-30 07:58:09','2025-06-19 03:03:27',NULL,NULL),(2,21,'354043dd-2394-42a6-8b7f-3e954d5835ce',6,'1993-04-23','married','+639663603171','Filipino','Programmer','http://10.0.0.185:5000/uploads/slide3-1749092524349.jpeg',1,'2020-04-23','PCMC','#1 Bonifacio Street','Concepcion Uno','City of Marikina','Metro Manila','luzon','I want to be a donor','activated',0,NULL,1,NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795',NULL,'2025-06-04 23:30:22','2025-06-27 00:35:39',23,4),(3,21,'c03662e1-5291-481d-9bd0-ad9f785db339',5,'1993-06-08','married','+639451175462','Filipino','Data Analyst',NULL,0,'','','#1 Bonifacio Street','Buting','City of Pasig','Metro Manila','luzon','','activated',0,NULL,1,NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795',NULL,'2025-06-05 00:49:37','2025-06-23 03:02:47',NULL,NULL),(4,21,'5515d7d1-c832-4835-92c8-8570815a838d',7,'2000-04-28','single','+639663603178','Filipino','Pal','http://10.0.0.185:5000/uploads/default-id-1749084782527.jpg',1,'2024-04-04','Tala','#1 Bonifacio Street','Barangay 175','City of Caloocan','Metro Manila','luzon','Molly Message','activated',1,NULL,1,NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795','207ac622-41c8-4f4d-948d-419bd6c0a795','2025-06-05 00:53:04','2025-06-23 03:01:01',NULL,NULL),(5,32,'8c4cafef-4acb-408d-8637-4c05e1549f17',5,'1993-04-23','single','+639663603172','Filipino','Programmer','http://10.0.0.185:5000/uploads/default-govt-issued-id-1749618208835.png',1,'2000-04-23','PGH','#1 Bonifacio Street','Apolonio Samson','Quezon City','Metro Manila','luzon','Blood Donor message','activated',0,NULL,0,NULL,'17f9e6dd-4bc2-403c-915b-ed637e60c051',NULL,'2025-06-11 05:03:30','2025-06-11 05:29:08',NULL,NULL),(6,21,'13bbd8c8-7df6-45cf-ba79-4a3f55d45620',NULL,'1993-04-23','single','+639663603172','Filipino','Programmer',NULL,0,'','','#1 Bonifacio Street','Jesus De La Pe├▒a','City of Marikina','Metro Manila','luzon','','activated',0,NULL,0,NULL,'207ac622-41c8-4f4d-948d-419bd6c0a795',NULL,'2025-06-17 00:33:51','2025-06-19 01:24:55',NULL,NULL),(7,21,'97dfcc89-0f86-4f0b-bd95-784532d8a1b4',5,'1993-04-23','single','+639663603172','Filipino','Programmer',NULL,1,'2024-06-06','Hospital','#1 Bonifacio Street','Mabini-J. Rizal','City of Mandaluyong','Metro Manila','luzon','','activated',0,NULL,0,NULL,'46f600a4-f8c2-4e6f-8bb1-e870caa1f520',NULL,'2025-06-17 01:07:58','2025-06-23 00:22:33',NULL,NULL),(8,21,'33715f7b-4059-43fa-a2a8-e32fe6b419f3',6,'1993-04-23','single','+639663603172','Filipino','Programmer','http://10.0.0.185:5000/uploads/pcmc-hospital-bg-1750638108889.jpg',1,'2025-03-23','PGH','#1 Bonifacio Street','Buting','City of Pasig','Metro Manila','luzon','','for approval',0,NULL,0,NULL,NULL,NULL,'2025-06-23 00:21:51','2025-06-23 00:21:51',NULL,NULL);
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
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `email_notifications_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_notifications`
--

LOCK TABLES `email_notifications` WRITE;
/*!40000 ALTER TABLE `email_notifications` DISABLE KEYS */;
INSERT INTO `email_notifications` VALUES (6,'[\"agency@email.com\"]',NULL,'≡ƒ⌐╕ Thank You for Registering - Your Agency Application is Pending Approval','\n    <!DOCTYPE html>\n        <html>\n            <head>\n                <style>\n                    body {\n                        font-family: Arial, sans-serif;\n                        background-color: #f5f5f5;\n                        padding: 20px;\n                    }\n\n                    .email-container {\n                        background-color: #ffffff;\n                        padding: 30px;\n                        border-radius: 8px;\n                        max-width: 600px;\n                        margin: auto;\n                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);\n                    }\n\n                    .footer {\n                        margin-top: 30px;\n                        font-size: 12px;\n                        color: #777;\n                    }\n                </style>\n            </head>\n            <body>\n                <div class=\"email-container\">\n                    <p>Dear <b>Mark Roman</b>,</p>\n\n                    <p>Thank you for registering Prime Agency to join the <a href=\"http://localhost:3000\"><strong>PCMC PedBC Blood Donation Portal</strong></a> as a partner in organizing mobile blood donation drives.</p>\n\n                    <p>Your application is currently under review by our <strong>Mobile Blood Donation Team (MBDT)</strong>. Once approved, you will receive a confirmation email with instructions on how to access your account.</p>\n\n                    <p><strong>Note:</strong> You will not be able to log in or use the platform until your registration has been approved.</p>\n\n                    <p><strong>Agency Details:</strong></p>\n                    <ul>\n                        <li><strong>Name:</strong> Prime Agency</li>\n                        <li><strong>Email:</strong> agency@email.com</li>\n                        <li><strong>Contact Number:</strong> +639656565655</li>\n                        <li><strong>Address:</strong> Agency Prime Building, Bambang, City of Pasig, Metro Manila.</li>\n                    </ul>\n\n                    <p>If you have any questions, feel free to reply to this email.</p>\n\n                    <br>\n                    <p>Thank you,<br>\n                    <strong>PCMC Pediatric Blood Center</strong></p>\n        \n\n                    <p class=\"footer\">\n                        Please do not reply to this automated message. For any clarifications, contact us at <a href=\"mark.roman@pcmc.gov.ph\">support@pcmc.gov.ph</a>.\n                    </p>\n                </div>\n            </body>\n        </html>\n    ',NULL,1,'4f1bac96-6b45-4512-bc55-8755107c22ea','2025-06-26 03:22:33','2025-06-26 03:22:33'),(7,'[\"mark.roman@pcmc.gov.ph\"]',NULL,'≡ƒôÑ New Agency Registration Request ΓÇô Action Required','\n    <!DOCTYPE html>\n        <html>\n            <head>\n                <style>\n                    body {\n                        font-family: Arial, sans-serif;\n                        background-color: #f5f5f5;\n                        padding: 20px;\n                    }\n\n                    .email-container {\n                        background-color: #ffffff;\n                        padding: 30px;\n                        border-radius: 8px;\n                        max-width: 600px;\n                        margin: auto;\n                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);\n                    }\n\n                    .footer {\n                        margin-top: 30px;\n                        font-size: 12px;\n                        color: #777;\n                    }\n                </style>\n            </head>\n            <body>\n                <div class=\"email-container\">\n                    <h2>New Agency Registration Alert</h2>\n                    <p>Dear MBDT,</p>\n\n                    <p>A new agency has submitted a registration request on our <a href=\"http://localhost:3000\"><strong>PCMC PedBC Blood Donation Portal</strong></a>.</p>\n\n                    <p><strong>Agency Details:</strong></p>\n                    <ul>\n                        <li><strong>Name:</strong> Prime Agency</li>\n                        <li><strong>Registered By:</strong> Mark Roman</li>\n                        <li><strong>Email:</strong> agency@email.com</li>\n                        <li><strong>Contact Number:</strong> +639656565655</li>\n                        <li><strong>Address:</strong> Agency Prime Building, Bambang, City of Pasig, Metro Manila.</li>\n                    </ul>\n\n                    <p>Please log in to review and approve or reject this request.</p>\n\n                    <br>\n                    <p>Thank you,<br>\n                    <strong>Blood Donation Portal System</strong></p>\n                </div>\n            </body>\n        </html>\n\n    ',NULL,1,'4f1bac96-6b45-4512-bc55-8755107c22ea','2025-06-26 03:22:36','2025-06-26 03:22:36');
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
  `status` enum('open','closed') NOT NULL,
  `has_limit` tinyint(1) DEFAULT '0',
  `max_limit` int DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `blood_donation_event_id` (`blood_donation_event_id`),
  CONSTRAINT `event_time_schedules_ibfk_1` FOREIGN KEY (`blood_donation_event_id`) REFERENCES `blood_donation_events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_time_schedules`
--

LOCK TABLES `event_time_schedules` WRITE;
/*!40000 ALTER TABLE `event_time_schedules` DISABLE KEYS */;
INSERT INTO `event_time_schedules` VALUES (1,23,'07:30:00','16:00:00','open',1,9,'207ac622-41c8-4f4d-948d-419bd6c0a795','2025-06-26 00:08:52','2025-06-26 06:00:15'),(2,24,'08:00:00','17:00:00','open',0,0,NULL,'2025-06-26 00:13:08','2025-06-26 00:13:08'),(3,25,'07:00:00','16:00:00','open',0,0,NULL,'2025-06-26 00:14:26','2025-06-26 00:14:26');
/*!40000 ALTER TABLE `event_time_schedules` ENABLE KEYS */;
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
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `reference_id` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'info',
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (2,'4f1bac96-6b45-4512-bc55-8755107c22ea','47','agency_for_approval','New Agency Registration','You have a new notification',0,0,'4f1bac96-6b45-4512-bc55-8755107c22ea','2025-06-26 03:22:36','2025-06-26 03:22:36');
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
  CONSTRAINT `physical_examinations_ibfk_69` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `physical_examinations_ibfk_70` FOREIGN KEY (`appointment_id`) REFERENCES `donor_appointment_infos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `physical_examinations_ibfk_71` FOREIGN KEY (`event_id`) REFERENCES `blood_donation_events` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `physical_examinations_ibfk_72` FOREIGN KEY (`examiner_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `physical_examinations`
--

LOCK TABLES `physical_examinations` WRITE;
/*!40000 ALTER TABLE `physical_examinations` DISABLE KEYS */;
INSERT INTO `physical_examinations` VALUES (4,2,26,23,'207ac622-41c8-4f4d-948d-419bd6c0a795','120/70',90,'13/15',60.00,36.0,'ACCEPTED','','',NULL,'2025-06-27 00:35:39','2025-06-27 00:35:39');
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
INSERT INTO `roles` VALUES (1,'Admin','FaUserLock','2025-05-09 00:14:16','2025-05-09 00:14:16','/portal/admin'),(2,'Donor','User','2025-05-09 00:14:16','2025-05-09 00:14:16','/portal/donors'),(3,'Developer','MdDeveloperMode','2025-05-09 00:14:16','2025-05-09 00:14:16','/portal/admin'),(4,'Agency Administrator','FaUserLock','2025-05-09 00:14:16','2025-05-09 00:14:16','/portal/hosts'),(5,'Organizer','FaUser','2025-05-09 00:14:16','2025-05-09 00:14:16','/portal/hosts');
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
  CONSTRAINT `screening_details_ibfk_35` FOREIGN KEY (`physical_examination_id`) REFERENCES `physical_examinations` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `screening_details_ibfk_36` FOREIGN KEY (`question_id`) REFERENCES `screening_questions` (`id`) ON UPDATE CASCADE
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
  CONSTRAINT `user_roles_ibfk_161` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_162` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (4,'207ac622-41c8-4f4d-948d-419bd6c0a795',1,1,'2025-05-22 06:35:22','2025-05-22 06:35:22'),(7,'7838dca3-13bd-41f0-9bf1-ef6707436ea2',4,0,'2025-05-23 00:39:52','2025-06-24 05:59:46'),(9,'b284b85b-cda1-4f98-9804-08563b0a06c9',1,1,'2025-05-23 01:35:48','2025-05-23 01:35:48'),(11,'b284b85b-cda1-4f98-9804-08563b0a06c9',5,1,'2025-05-23 01:57:27','2025-05-23 01:57:27'),(12,'b284b85b-cda1-4f98-9804-08563b0a06c9',2,1,'2025-05-23 02:54:53','2025-05-23 02:54:53'),(13,'207ac622-41c8-4f4d-948d-419bd6c0a795',4,1,'2025-05-23 06:13:31','2025-05-23 06:13:31'),(15,'eb040f6e-585c-4cb6-8205-7883d2e00da7',2,0,'2025-05-28 00:27:13','2025-05-28 00:27:13'),(17,'62e044f9-97b9-42e0-b1f9-504f0530713f',4,1,'2025-05-30 00:06:44','2025-05-30 00:54:37'),(18,'806e519a-8b1d-4176-854a-68394bd84d09',4,0,'2025-05-30 00:09:14','2025-06-23 00:01:17'),(20,'b10b971a-ad59-4cc0-bde2-65136c3c37ac',4,1,'2025-05-30 00:53:28','2025-05-30 00:54:46'),(25,'866c0cc2-a888-46e7-b619-c3fa3c337c0f',2,1,'2025-05-30 07:58:09','2025-06-03 23:27:19'),(31,'7b9704bc-a663-474d-b8c1-cb5c88679bd9',5,0,'2025-06-02 02:31:29','2025-06-03 00:50:40'),(35,'0f4dd342-9793-4eef-8322-307ed4e6b89e',5,1,'2025-06-02 02:46:30','2025-06-02 23:57:18'),(36,'17f9e6dd-4bc2-403c-915b-ed637e60c051',5,1,'2025-06-03 03:30:47','2025-06-11 05:05:24'),(37,'354043dd-2394-42a6-8b7f-3e954d5835ce',2,1,'2025-06-04 23:30:22','2025-06-04 23:32:36'),(38,'c03662e1-5291-481d-9bd0-ad9f785db339',2,1,'2025-06-05 00:49:37','2025-06-11 06:05:59'),(39,'5515d7d1-c832-4835-92c8-8570815a838d',2,1,'2025-06-05 00:53:04','2025-06-11 06:06:03'),(40,'6fc5f16a-5da6-4e94-85b8-20b20569c5f5',4,0,'2025-06-11 05:01:30','2025-06-11 05:01:30'),(41,'8c4cafef-4acb-408d-8637-4c05e1549f17',2,1,'2025-06-11 05:03:30','2025-06-11 05:29:08'),(42,'46f600a4-f8c2-4e6f-8bb1-e870caa1f520',5,1,'2025-06-11 06:43:14','2025-06-11 06:45:31'),(43,'13bbd8c8-7df6-45cf-ba79-4a3f55d45620',2,1,'2025-06-17 00:33:51','2025-06-19 01:24:56'),(44,'97dfcc89-0f86-4f0b-bd95-784532d8a1b4',2,1,'2025-06-17 01:07:58','2025-06-23 00:22:33'),(45,'33715f7b-4059-43fa-a2a8-e32fe6b419f3',2,0,'2025-06-23 00:21:51','2025-06-23 00:21:51'),(46,'af2f4108-7d04-46ea-ae8b-e86a07d3a1e8',4,1,'2025-06-23 02:37:21','2025-06-24 05:57:57'),(47,'414702ce-b343-4c34-8b5a-824b8c911172',5,0,'2025-06-23 02:54:34','2025-06-23 02:54:34'),(52,'95d748e8-9887-47e3-ae60-8630dbef0b9c',4,1,'2025-06-24 00:25:04','2025-06-24 06:16:34'),(53,'97d39810-9543-4029-8da0-1f1cd56884fc',4,0,'2025-06-24 05:20:19','2025-06-24 05:20:19'),(55,'4f1bac96-6b45-4512-bc55-8755107c22ea',4,0,'2025-06-26 03:22:30','2025-06-26 03:22:30');
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
  `password` varchar(255) NOT NULL DEFAULT '$2b$10$vMKWmxIQYwhdzC6z8ib6WemmYhgf2aw9xSdapF9LbPOu/O8hCCNxy',
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
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('0f4dd342-9793-4eef-8322-307ed4e6b89e','Kram Coordinator','kramcoor@email.com',NULL,NULL,'$2b$10$w08pZ0dPyihJmY13k3pLse.2seu2SmRS4kmQ2qnZR5Bqo9lACIpKq','Kram','Coordinator',NULL,NULL,NULL,'male',1,NULL,'2025-06-02 02:46:30','2025-06-02 02:46:30'),('13bbd8c8-7df6-45cf-ba79-4a3f55d45620','Mark Oliver Roman','markoliver01728@gmail.com',NULL,NULL,'$2b$10$1sgnPoHOIlJfh40pY3GJkeiDK72Jd79zOTmE9iEMdMDKa0Zs4M3TG','Mark Oliver','Roman','Carme',NULL,NULL,'male',1,NULL,'2025-06-17 00:33:50','2025-06-17 00:33:50'),('17f9e6dd-4bc2-403c-915b-ed637e60c051','Mets Coordinator','metz@email.com',NULL,NULL,'$2b$10$RxUclthG5yIPIIWESJUqf./rbWWE4Fnl6L.dtjWUQ518p.3K.MZr6','Mets','Coordinator',NULL,NULL,NULL,'male',1,NULL,'2025-06-03 03:30:47','2025-06-03 03:30:47'),('207ac622-41c8-4f4d-948d-419bd6c0a795','Mark Nomar','admin@email.com','http://10.0.0.185:5000/uploads/avatar 3-1749023390163.png',NULL,'$2b$10$NbCC618SbUbMgY2x5tDZI.G9UjNFBNbFjPlvQMnBCGHhzlXEeiIxO','Mark','Nomar','',NULL,NULL,'male',1,'207ac622-41c8-4f4d-948d-419bd6c0a795','2025-05-21 07:55:04','2025-05-21 07:55:04'),('33715f7b-4059-43fa-a2a8-e32fe6b419f3','Mark Eight Roman','mark0625@email.com',NULL,NULL,'$2b$10$lSvNGfbtX82xXXwrW2fULeuPuRixgjKyfOXtfC4eV4A4SwpnREyR6','Mark Eight','Roman','Po',NULL,NULL,'male',1,NULL,'2025-06-23 00:21:50','2025-06-23 00:21:50'),('354043dd-2394-42a6-8b7f-3e954d5835ce','Donors Ako','donor@email.com','http://10.0.0.185:5000/uploads/logo-1-1749079820781.jpeg',NULL,'$2b$10$2RgEWkHNAnqh9sMn9Wd.4epkJB9qT61V8dV/gXk15bovu/DwUUAh6','Donors','Ako','Ca',NULL,NULL,'male',1,'354043dd-2394-42a6-8b7f-3e954d5835ce','2025-06-04 23:30:22','2025-06-04 23:30:22'),('414702ce-b343-4c34-8b5a-824b8c911172','Mark Roman','coordinator2@email.com',NULL,NULL,'$2b$10$gjGEDkaxfaqqWTT.oNmTDupzHa4I/IsXeqWYbn4LVBjiHkFiyoKg6','Mark','Roman','',NULL,NULL,'male',1,NULL,'2025-06-23 02:54:34','2025-06-23 02:54:34'),('46f600a4-f8c2-4e6f-8bb1-e870caa1f520','Agency Prime  Coordinator','agency-prime-coor@email.com',NULL,NULL,'$2b$10$aqkvepjY4C9uPubbSNYVI.aeq/aNNgxbzaZ2W3yVKZgOg6HUU2Ccu','Agency Prime ','Coordinator',NULL,NULL,NULL,'female',1,NULL,'2025-06-11 06:43:14','2025-06-11 06:43:14'),('4f1bac96-6b45-4512-bc55-8755107c22ea','Mark Roman','agency@email.com',NULL,NULL,'$2b$10$6IgiLVshje3IufdKU.gFweFSiXa//r3IUmF.HPRlXYrf7orXCuF2q','Mark','Roman','',NULL,NULL,'female',1,NULL,'2025-06-26 03:22:30','2025-06-26 03:22:30'),('5515d7d1-c832-4835-92c8-8570815a838d','Molly Holly','molly@email.com',NULL,NULL,'$2b$10$E9Lo9Y3VlVsIQXBE28Y/G.w0MN9rl.MVQZZ8HqyeIAuETIsdSpH2.','Molly','Holly','CSA',NULL,NULL,'female',1,'207ac622-41c8-4f4d-948d-419bd6c0a795','2025-06-05 00:53:04','2025-06-05 00:53:04'),('62e044f9-97b9-42e0-b1f9-504f0530713f','Mark Roman','mark29@email.com',NULL,NULL,'$2b$10$TxmjSWhb5EcgnXkw3/T5uO64xvVOT8l6/8jnufR0w2kc9ocoYt6f6','Mark','Roman',NULL,NULL,NULL,'male',1,NULL,'2025-05-30 00:06:44','2025-05-30 00:06:44'),('6fc5f16a-5da6-4e94-85b8-20b20569c5f5','Organizer Me','organizer@email.com',NULL,NULL,'$2b$10$iN51oIgs8Uja2x3WfdnS5OTxjj3194czuPuh6ueG0/.ezD7i2Zgmy','Organizer','Me',NULL,NULL,NULL,'male',1,NULL,'2025-06-11 05:01:29','2025-06-11 05:01:29'),('7838dca3-13bd-41f0-9bf1-ef6707436ea2','Mark Roman','mark23@email.com',NULL,NULL,'$2b$10$PgWD/jrYL0w/JvLbnoL3EuVRhI27ol1fxLakFYnbgbrbfBIPMLOAi','Mark','Roman',NULL,NULL,NULL,'male',1,NULL,'2025-05-23 00:39:52','2025-05-23 00:39:52'),('7b9704bc-a663-474d-b8c1-cb5c88679bd9','Vane Romano','vanes29@email.com',NULL,NULL,'$2b$10$KoIevn9QIB3c0md8q084oeBHr5pBgx3JmE9GIpFKZcwuc2MbtXXrC','Vane','Romano',NULL,NULL,NULL,'female',1,NULL,'2025-06-02 02:31:29','2025-06-02 02:31:29'),('806e519a-8b1d-4176-854a-68394bd84d09','Krame Nomar','mark30@email.com','http://10.0.0.185:5000/uploads/eada3c3c-4e1a-461e-8233-cf1deffbaaa2-profile-1748563749610.png',NULL,'$2b$10$Qb4PYqkG0UiTxl23.hEXDOkEc4YR62vwvgo5TowtdxY7I77cBaele','Krame','Nomar',NULL,NULL,NULL,'male',1,NULL,'2025-05-30 00:09:14','2025-05-30 00:09:14'),('866c0cc2-a888-46e7-b619-c3fa3c337c0f','Mark Roman','mark35@email.com',NULL,NULL,'$2b$10$LSc8JV7DzmTeML1bi7Y35OBlVuPC5taqIb7e2I6bz3NjEoWymvJPe','Mark','Roman','Ca',NULL,NULL,'male',1,'207ac622-41c8-4f4d-948d-419bd6c0a795','2025-05-30 07:58:09','2025-05-30 07:58:09'),('8c4cafef-4acb-408d-8637-4c05e1549f17','Blood  Donor','blood@email.com','http://10.0.0.185:5000/uploads/avatar 2-1749618208800.png',NULL,'$2b$10$uC6ncLOIhqJPJVWmZywequemFb96ZDCbstjGTA0Yjpmo0dbraUQ4u','Blood ','Donor',NULL,NULL,NULL,'male',1,NULL,'2025-06-11 05:03:30','2025-06-11 05:03:30'),('95d748e8-9887-47e3-ae60-8630dbef0b9c','Kram Mac','hr@email.com',NULL,NULL,'$2b$10$4vMecpBX5dhQ5Qg6yiTV6u4./CSVtFwa05gAvDoPJwDfTmZ79wJKC','Kram','Mac','',NULL,NULL,'male',1,NULL,'2025-06-24 00:25:04','2025-06-24 00:25:04'),('97d39810-9543-4029-8da0-1f1cd56884fc','Agency Admin One','mark.roman@pcmc.gov.ph',NULL,NULL,'$2b$10$7O4/GAckPlyyqahFCM7Jj.qqAkUpmASL1MtS/GUYwugvhI9jj8b6O','Agency','Admin One','',NULL,NULL,'female',1,NULL,'2025-06-24 05:20:19','2025-06-24 05:20:19'),('97dfcc89-0f86-4f0b-bd95-784532d8a1b4','Xit Roman','xit@email.com',NULL,NULL,'$2b$10$hKLlx/zp0zntNRDQTVsTu.TP/11gHi5J2dcjhh.5EuxaXwzk2F9Xa','Xit','Roman',NULL,NULL,NULL,'male',1,NULL,'2025-06-17 01:07:58','2025-06-17 01:07:58'),('af2f4108-7d04-46ea-ae8b-e86a07d3a1e8','Hr Account','h@email.com','http://10.0.0.185:5000/uploads/avatar 3-1750646241713.png',NULL,'$2b$10$xPK2EuYnr4WYlzpgyY2iDOB0Ss9NtHD32eCkYQVFr0lALuELo1jXe','Hr','Account','',NULL,NULL,'male',1,NULL,'2025-06-23 02:37:21','2025-06-23 02:37:21'),('b10b971a-ad59-4cc0-bde2-65136c3c37ac','Neo Roman','neo29@email.com','http://10.0.0.185:5000/uploads/avatar 2-1748566402739.png',NULL,'$2b$10$WxUCSwJrkQOTAhsT8mWsR.0TiOjgbrYvm/6bPEBNgFqO27FU7jxnS','Neo','Roman',NULL,NULL,NULL,'female',1,NULL,'2025-05-30 00:53:28','2025-05-30 00:53:28'),('b284b85b-cda1-4f98-9804-08563b0a06c9','Kram Romano','mark24@email.com',NULL,NULL,'$2b$10$5OCO4ZxXuvvJN4UH.eGnAOH.3slGGornHCAkx6RoW7ZL/a1Y2QFVW','Kram','Romano','Carmesis',NULL,NULL,'male',1,'b284b85b-cda1-4f98-9804-08563b0a06c9','2025-05-23 01:35:48','2025-05-23 01:35:48'),('c03662e1-5291-481d-9bd0-ad9f785db339','Vanessa Amper','vanessa@email.com',NULL,NULL,'$2b$10$twItbi/ziJqAO3ht/60wVeBgujTqk1N.4KnXkqeUQjUuaHaDowuby','Vanessa','Amper',NULL,NULL,NULL,'female',1,NULL,'2025-06-05 00:49:37','2025-06-05 00:49:37'),('eb040f6e-585c-4cb6-8205-7883d2e00da7','Kram Nomar','mark28@email.com',NULL,NULL,'$2b$10$pffcQvvrvb6drYKElelYe.hdgfrjYESRRIjl5wRU.EMjIv.0SRkza','Kram','Nomar',NULL,NULL,NULL,'male',1,NULL,'2025-05-28 00:27:13','2025-05-28 00:27:13');
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

-- Dump completed on 2025-06-27  1:18:29
