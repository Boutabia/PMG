CREATE TABLE `scenario` (
  `scenarioid` int NOT NULL,
  `scenarioname` varchar(60) NOT NULL,
  `questionid` int NOT NULL,
  PRIMARY KEY (`scenarioid`),
  UNIQUE KEY `questionid_UNIQUE` (`questionid`),
  UNIQUE KEY `scenarioid_UNIQUE` (`scenarioid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `category` (
  `categoryid` int NOT NULL,
  `categoryname` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`categoryid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `scenariocategory` (
  `scenarioid` int NOT NULL,
  `categoryid` int NOT NULL,
  PRIMARY KEY (`scenarioid`,`categoryid`),
  KEY `categoryid_idx` (`categoryid`),
  CONSTRAINT `categoryid` FOREIGN KEY (`categoryid`) REFERENCES `category` (`categoryid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `scenarioid` FOREIGN KEY (`scenarioid`) REFERENCES `scenario` (`scenarioid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `questionlist` (
  `questionid` int NOT NULL,
  `questiontype` int NOT NULL,
  PRIMARY KEY (`questionid`),
  UNIQUE KEY `questionid_UNIQUE` (`questionid`),
  CONSTRAINT `questionid` FOREIGN KEY (`questionid`) REFERENCES `scenario` (`questionid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `qmultiplechoice` (
  `questionid` int NOT NULL,
  `questiontext` varchar(300) NOT NULL,
  `picture` varchar(90) DEFAULT NULL,
  `option1` varchar(140) DEFAULT NULL,
  `option2` varchar(140) DEFAULT NULL,
  `option3` varchar(140) DEFAULT NULL,
  `option4` varchar(140) DEFAULT NULL,
  `correct1` tinyint DEFAULT NULL,
  `correct2` tinyint DEFAULT NULL,
  `correct3` tinyint DEFAULT NULL,
  `correct4` tinyint DEFAULT NULL,
  `explanation` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`questionid`),
  UNIQUE KEY `questionid_UNIQUE` (`questionid`),
  CONSTRAINT `qid` FOREIGN KEY (`questionid`) REFERENCES `questionlist` (`questionid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user` (
  `id` int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `passwordhash` varchar(255) DEFAULT NULL,
  `role` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
