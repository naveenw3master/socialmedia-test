/*
SQLyog Community v13.1.2 (64 bit)
MySQL - 5.5.58-0ubuntu0.14.04.1 : Database - socialmedia
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `comments` */

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `CommentID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `PostFKID` int(11) NOT NULL,
  `UserFKID` int(11) NOT NULL,
  `Message` text COLLATE utf8_unicode_ci NOT NULL,
  `ParentFKID` int(11) NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Status` enum('ACTIVE','INACTIVE') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'INACTIVE',
  PRIMARY KEY (`CommentID`),
  KEY `PostFKID` (`PostFKID`),
  KEY `UserFKID` (`UserFKID`),
  KEY `ParentFKID` (`ParentFKID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `comments` */

insert  into `comments`(`CommentID`,`PostFKID`,`UserFKID`,`Message`,`ParentFKID`,`CreatedOn`,`Status`) values 
(1,1,1,'Lorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industry',0,'2019-03-26 16:32:53','ACTIVE'),
(2,1,1,'Lorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industry',1,'2019-03-26 16:33:05','ACTIVE'),
(3,1,1,'Lorem Ipsum is simply dummy text of the printing and typesetting industry',0,'2019-03-26 16:33:17','ACTIVE'),
(4,1,1,'Lorem Ipsum is simply dummy text of the printing and typesetting industry',3,'2019-03-26 16:33:21','ACTIVE'),
(5,1,1,'Lorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industry',3,'2019-03-26 16:33:27','ACTIVE'),
(6,1,2,'Lorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industry',3,'2019-03-26 16:34:20','ACTIVE');

/*Table structure for table `likes` */

DROP TABLE IF EXISTS `likes`;

CREATE TABLE `likes` (
  `LikeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Type` enum('POST','COMMENT') COLLATE utf8_unicode_ci NOT NULL,
  `UserFKID` int(11) NOT NULL,
  `PostFKID` int(11) NOT NULL,
  `CommentFKID` int(11) NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Status` enum('ACTIVE','INACTIVE') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'INACTIVE',
  PRIMARY KEY (`LikeID`),
  KEY `PostFKID` (`PostFKID`),
  KEY `UserFKID` (`UserFKID`),
  KEY `CommentFKID` (`CommentFKID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `likes` */

insert  into `likes`(`LikeID`,`Type`,`UserFKID`,`PostFKID`,`CommentFKID`,`CreatedOn`,`Status`) values 
(1,'POST',1,1,0,'2019-03-26 16:32:37','ACTIVE'),
(2,'COMMENT',1,0,1,'2019-03-26 16:33:00','ACTIVE'),
(3,'COMMENT',1,0,2,'2019-03-26 16:33:08','ACTIVE'),
(4,'COMMENT',1,0,3,'2019-03-26 16:33:19','ACTIVE'),
(5,'POST',2,1,0,'2019-03-26 16:34:07','ACTIVE'),
(6,'COMMENT',2,0,6,'2019-03-26 16:34:23','ACTIVE'),
(7,'COMMENT',2,0,3,'2019-03-26 16:34:26','ACTIVE');

/*Table structure for table `posts` */

DROP TABLE IF EXISTS `posts`;

CREATE TABLE `posts` (
  `PostID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `UserFKID` int(10) unsigned NOT NULL,
  `Title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `Description` text COLLATE utf8_unicode_ci NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Status` enum('ACTIVE','INACTIVE') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'INACTIVE',
  PRIMARY KEY (`PostID`),
  KEY `UserFKID` (`UserFKID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `posts` */

insert  into `posts`(`PostID`,`UserFKID`,`Title`,`Description`,`CreatedOn`,`Status`) values 
(1,1,'Lorem Ipsum is simply dummy text of the printing and typesetting industry','Lorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industry','2019-03-26 16:32:27','ACTIVE'),
(2,2,'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry','Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry','2019-03-26 16:35:02','ACTIVE');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `UserID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `Email` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `Password` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Status` enum('ACTIVE','INACTIVE') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'INACTIVE',
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `users` */

insert  into `users`(`UserID`,`Name`,`Email`,`Password`,`CreatedOn`,`Status`) values 
(1,'Naveen','naveen.w3master@gmail.com','12345','2019-03-26 16:32:07','ACTIVE'),
(2,'Sharath','sharath.bodapati@gmail.com','12345','2019-03-26 16:33:51','ACTIVE');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
