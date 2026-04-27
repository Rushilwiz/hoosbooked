START TRANSACTION;

CREATE TABLE
  `Amenity` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `description` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
  );

CREATE TABLE
  `User` (
    `id` int NOT NULL AUTO_INCREMENT,
    `username` varchar(255) NOT NULL UNIQUE,
    `password` varchar(255) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
  );

CREATE TABLE
  `Building` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `address` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
  );

CREATE TABLE
  `Building_Coordinates` (
    `building_id` int NOT NULL,
    `latitude` decimal(10, 8) NOT NULL,
    `longitude` decimal(11, 8) NOT NULL,
    PRIMARY KEY (building_id),
    FOREIGN KEY (building_id) REFERENCES Building (id) ON DELETE CASCADE
  );

CREATE TABLE
  `Room` (
    `id` int NOT NULL AUTO_INCREMENT,
    `number` varchar(255) NULL,
    `building_id` int NOT NULL,
    `capacity` int NOT NULL,
    PRIMARY KEY (id, building_id),
    FOREIGN KEY (building_id) REFERENCES Building (id) ON DELETE CASCADE
  );

CREATE TABLE
  `Booking` (
    `booking_id` varchar(255) NOT NULL,
    `purpose` text DEFAULT NULL,
    `start_time` timestamp NOT NULL,
    `end_time` timestamp NOT NULL,
    `date` timestamp NOT NULL,
    `participants` int NULL DEFAULT 1,
    `room_id` int NOT NULL,
    `building_id` int NOT NULL,
    `user_id` int NOT NULL,
    UNIQUE KEY `unique_booking` (
      `room_id`,
      `building_id`,
      `date`,
      `start_time`,
      `end_time`
    ),
    PRIMARY KEY (booking_id, room_id, building_id, user_id),
    FOREIGN KEY (room_id, building_id) REFERENCES Room (id, building_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE
  );

CREATE TABLE
  `Notifications` (
    `notification_id` varchar(255) NOT NULL,
    `user_id` int NOT NULL,
    `message` text NOT NULL,
    `viewed` tinyint (1) NOT NULL DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (notification_id, user_id),
    FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE
  );

CREATE TABLE
  `Open_Hours` (
    `building_id` int NOT NULL,
    `day` varchar(255) NOT NULL,
    `open_time` time NOT NULL,
    `closing_time` time NOT NULL,
    PRIMARY KEY (building_id, day, open_time, closing_time),
    FOREIGN KEY (building_id) REFERENCES Building (id) ON DELETE CASCADE
  );

CREATE TABLE
  `Rating` (
    `id` int NOT NULL AUTO_INCREMENT,
    `room_id` int NOT NULL,
    `building_id` int NOT NULL,
    `user_id` int NOT NULL,
    `value` int NOT NULL CHECK (
      `value` > 0
      AND `value` < 6
    ),
    `description` text DEFAULT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (room_id, building_id) REFERENCES Room (id, building_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE
  );

CREATE TABLE
  `Room_Amenity` (
    `room_id` int NOT NULL,
    `building_id` int NOT NULL,
    `amenity_id` int NOT NULL,
    PRIMARY KEY (room_id, building_id, amenity_id),
    FOREIGN KEY (room_id, building_id) REFERENCES Room (id, building_id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES Amenity (id) ON DELETE CASCADE
  );

CREATE TABLE
  `User_Email` (
    `user_id` int NOT NULL,
    `email` varchar(255) NOT NULL,
    PRIMARY KEY (`user_id`, `email`),
    FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE
  );

CREATE TABLE
  `User_PhoneNumber` (
    `user_id` int NOT NULL,
    `phone` varchar(20) NOT NULL,
    PRIMARY KEY (`user_id`, `phone`),
    FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE
  );

CREATE TABLE
  `User_Notification_Preference` (
    `user_id` int NOT NULL,
    `notify_by_mail` tinyint (1) NOT NULL DEFAULT 1,
    `notify_by_text` tinyint (1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`user_id`),
    FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE
  );

DELIMITER $$ CREATE TRIGGER makeBlankPreference AFTER INSERT ON User FOR EACH ROW BEGIN INSERT INTO User_Notification_Preference VALUES (NEW.id, 1, 1); END $$ DELIMITER ;


COMMIT;