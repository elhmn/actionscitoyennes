-- MySQL dump 10.13  Distrib 5.6.38, for osx10.9 (x86_64)
--
-- Host: localhost    Database: actions_citoyennes
-- ------------------------------------------------------
-- Server version	5.6.38

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `actions_citoyennes`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `actions_citoyennes` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `actions_citoyennes`;

--
-- Table structure for table `Actions`
--

DROP TABLE IF EXISTS `Actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Actions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(256) NOT NULL,
  `street` varchar(100) NOT NULL,
  `address_info` varchar(100) DEFAULT NULL,
  `postal_code` int(10) unsigned DEFAULT NULL,
  `city` varchar(40) NOT NULL,
  `coutry` varchar(40) NOT NULL,
  `description` varchar(3000) DEFAULT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `duration` time DEFAULT NULL,
  `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_id` (`user_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Comments`
--

DROP TABLE IF EXISTS `Comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `action_id` int(10) unsigned DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `content` varchar(1000) DEFAULT NULL,
  `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cmt_action_id_constraint` (`action_id`),
  KEY `cmt_user_id_constraint` (`user_id`),
  CONSTRAINT `cmt_action_id_constraint` FOREIGN KEY (`action_id`) REFERENCES `Actions` (`id`),
  CONSTRAINT `cmt_user_id_constraint` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Extras`
--

DROP TABLE IF EXISTS `Extras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Extras` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(256) NOT NULL,
  `street` varchar(100) NOT NULL,
  `address_info` varchar(100) DEFAULT NULL,
  `postal_code` int(10) unsigned DEFAULT NULL,
  `city` varchar(40) NOT NULL,
  `coutry` varchar(40) NOT NULL,
  `description` varchar(400) DEFAULT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `duration` time DEFAULT NULL,
  `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int(10) unsigned NOT NULL,
  `action_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_action_user_id` (`user_id`),
  KEY `fk_action_id` (`action_id`),
  CONSTRAINT `fk_action_id` FOREIGN KEY (`action_id`) REFERENCES `Actions` (`id`),
  CONSTRAINT `fk_action_user_id` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Images`
--

DROP TABLE IF EXISTS `Images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Images` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `file` varchar(400) NOT NULL,
  `action_id` int(10) unsigned DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `img_action_id_constraint` (`action_id`),
  KEY `img_user_id_constraint` (`user_id`),
  CONSTRAINT `img_action_id_constraint` FOREIGN KEY (`action_id`) REFERENCES `Actions` (`id`),
  CONSTRAINT `img_user_id_constraint` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `LaborContributions`
--

DROP TABLE IF EXISTS `LaborContributions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LaborContributions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `laborNeed_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `action_id` int(10) unsigned DEFAULT NULL,
  `extra_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_laborContributions_action_id` (`action_id`),
  KEY `fk_laborContributions_extra_id` (`extra_id`),
  KEY `fk_laborContributions_LaborNeeds_id` (`laborNeed_id`),
  KEY `fk_laborContributions_user_id` (`user_id`),
  CONSTRAINT `fk_laborContributions_LaborNeeds_id` FOREIGN KEY (`laborNeed_id`) REFERENCES `LaborNeeds` (`id`),
  CONSTRAINT `fk_laborContributions_action_id` FOREIGN KEY (`action_id`) REFERENCES `Actions` (`id`),
  CONSTRAINT `fk_laborContributions_extra_id` FOREIGN KEY (`extra_id`) REFERENCES `Extras` (`id`),
  CONSTRAINT `fk_laborContributions_user_id` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `LaborNeeds`
--

DROP TABLE IF EXISTS `LaborNeeds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LaborNeeds` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(256) DEFAULT NULL,
  `description` varchar(400) DEFAULT NULL,
  `required` int(10) unsigned NOT NULL DEFAULT '0',
  `collected` int(10) unsigned NOT NULL DEFAULT '0',
  `action_id` int(10) unsigned DEFAULT NULL,
  `extra_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_laborNeeds_action_id` (`action_id`),
  KEY `fk_laborNeeds_extra_id` (`extra_id`),
  CONSTRAINT `fk_laborNeeds_action_id` FOREIGN KEY (`action_id`) REFERENCES `Actions` (`id`),
  CONSTRAINT `fk_laborNeeds_extra_id` FOREIGN KEY (`extra_id`) REFERENCES `Extras` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MaterialContributions`
--

DROP TABLE IF EXISTS `MaterialContributions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MaterialContributions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `materialNeed_id` int(10) unsigned NOT NULL,
  `amount` double(13,2) NOT NULL DEFAULT '0.00',
  `user_id` int(10) unsigned NOT NULL,
  `action_id` int(10) unsigned DEFAULT NULL,
  `extra_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_materialContributions_action_id` (`action_id`),
  KEY `fk_materialContributions_extra_id` (`extra_id`),
  KEY `fk_materialContributions_MaterialNeeds_id` (`materialNeed_id`),
  KEY `fk_materialContributions_user_id` (`user_id`),
  CONSTRAINT `fk_materialContributions_MaterialNeeds_id` FOREIGN KEY (`materialNeed_id`) REFERENCES `MaterialNeeds` (`id`),
  CONSTRAINT `fk_materialContributions_action_id` FOREIGN KEY (`action_id`) REFERENCES `Actions` (`id`),
  CONSTRAINT `fk_materialContributions_extra_id` FOREIGN KEY (`extra_id`) REFERENCES `Extras` (`id`),
  CONSTRAINT `fk_materialContributions_user_id` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=214 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MaterialNeeds`
--

DROP TABLE IF EXISTS `MaterialNeeds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MaterialNeeds` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(256) NOT NULL,
  `description` varchar(400) DEFAULT NULL,
  `required` double(13,2) NOT NULL DEFAULT '0.00',
  `collected` double(13,2) NOT NULL DEFAULT '0.00',
  `unit` varchar(256) NOT NULL DEFAULT 'none',
  `action_id` int(10) unsigned DEFAULT NULL,
  `extra_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_materialNeeds_action_id` (`action_id`),
  KEY `fk_materialNeeds_extra_id` (`extra_id`),
  CONSTRAINT `fk_materialNeeds_action_id` FOREIGN KEY (`action_id`) REFERENCES `Actions` (`id`),
  CONSTRAINT `fk_materialNeeds_extra_id` FOREIGN KEY (`extra_id`) REFERENCES `Extras` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MoneyContributions`
--

DROP TABLE IF EXISTS `MoneyContributions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MoneyContributions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `amount` decimal(13,2) NOT NULL DEFAULT '0.00',
  `moneyNeed_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `action_id` int(10) unsigned DEFAULT NULL,
  `extra_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_moneyContributions_action_id` (`action_id`),
  KEY `fk_moneyContributions_extra_id` (`extra_id`),
  KEY `fk_moneyContributions_moneyNeeds_id` (`moneyNeed_id`),
  KEY `fk_moneyContributions_user_id` (`user_id`),
  CONSTRAINT `fk_moneyContributions_action_id` FOREIGN KEY (`action_id`) REFERENCES `Actions` (`id`),
  CONSTRAINT `fk_moneyContributions_extra_id` FOREIGN KEY (`extra_id`) REFERENCES `Extras` (`id`),
  CONSTRAINT `fk_moneyContributions_moneyNeeds_id` FOREIGN KEY (`moneyNeed_id`) REFERENCES `MoneyNeeds` (`id`),
  CONSTRAINT `fk_moneyContributions_user_id` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MoneyNeeds`
--

DROP TABLE IF EXISTS `MoneyNeeds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MoneyNeeds` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(256) NOT NULL,
  `description` varchar(400) DEFAULT NULL,
  `required` decimal(13,2) NOT NULL DEFAULT '0.00',
  `collected` decimal(13,2) NOT NULL DEFAULT '0.00',
  `unit` varchar(256) NOT NULL DEFAULT 'fcfa',
  `action_id` int(10) unsigned DEFAULT NULL,
  `extra_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_moneyNeeds_action_id` (`action_id`),
  KEY `fk_moneyNeeds_extra_id` (`extra_id`),
  CONSTRAINT `fk_moneyNeeds_action_id` FOREIGN KEY (`action_id`) REFERENCES `Actions` (`id`),
  CONSTRAINT `fk_moneyNeeds_extra_id` FOREIGN KEY (`extra_id`) REFERENCES `Extras` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `firstname` varchar(40) DEFAULT NULL,
  `lastname` varchar(40) DEFAULT NULL,
  `login` varchar(40) DEFAULT NULL,
  `email` varchar(320) NOT NULL,
  `password` char(128) NOT NULL,
  `city` varchar(40) DEFAULT NULL,
  `country` varchar(40) DEFAULT NULL,
  `bio` varchar(256) DEFAULT NULL,
  `picture` blob,
  `phonenumber` varchar(40) DEFAULT NULL,
  `gender` enum('male','female') NOT NULL,
  `postmethod` enum('all','own','none') NOT NULL DEFAULT 'own',
  `patchmethod` enum('all','own','none') NOT NULL DEFAULT 'own',
  `getmethod` enum('all','own','none') NOT NULL DEFAULT 'own',
  `delmethod` enum('all','own','none') NOT NULL DEFAULT 'own',
  `signup_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ind_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-16 12:00:13
