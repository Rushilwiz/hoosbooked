CREATE TABLE `Amenity` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `Amenity_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Booking` (
	`booking_id` varchar(255) NOT NULL,
	`purpose` text,
	`start_time` timestamp NOT NULL,
	`end_time` timestamp NOT NULL,
	`date` timestamp NOT NULL,
	`room_id` int NOT NULL,
	`building_id` int NOT NULL,
	`user_id` varchar(255) NOT NULL,
	CONSTRAINT `Booking_booking_id` PRIMARY KEY(`booking_id`)
);
--> statement-breakpoint
CREATE TABLE `Building` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	CONSTRAINT `Building_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Notifications` (
	`notification_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`viewed` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `Notifications_notification_id` PRIMARY KEY(`notification_id`)
);
--> statement-breakpoint
CREATE TABLE `Open_Hours` (
	`building_id` int NOT NULL,
	`day` varchar(255) NOT NULL,
	`open_time` timestamp NOT NULL,
	`closing_time` timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Rating` (
	`id` int AUTO_INCREMENT NOT NULL,
	`room_id` int NOT NULL,
	`building_id` int NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`value` int NOT NULL,
	`description` text,
	CONSTRAINT `Rating_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Room_Amenity` (
	`room_id` int NOT NULL,
	`building_id` int NOT NULL,
	`amenity_id` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Room` (
	`id` int AUTO_INCREMENT NOT NULL,
	`number` int NOT NULL,
	`building_id` int NOT NULL,
	`capacity` int NOT NULL,
	CONSTRAINT `Room_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `User_Email` (
	`user_id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `User_Notification_Preference` (
	`user_id` varchar(255) NOT NULL,
	`notify_by_mail` boolean NOT NULL DEFAULT true,
	`notify_by_text` boolean NOT NULL DEFAULT true,
	CONSTRAINT `User_Notification_Preference_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `User_PhoneNumber` (
	`user_id` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `User_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_room_id_Room_id_fk` FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_building_id_Building_id_fk` FOREIGN KEY (`building_id`) REFERENCES `Building`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_user_id_User_id_fk` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_user_id_User_id_fk` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Open_Hours` ADD CONSTRAINT `Open_Hours_building_id_Building_id_fk` FOREIGN KEY (`building_id`) REFERENCES `Building`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_room_id_Room_id_fk` FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_building_id_Building_id_fk` FOREIGN KEY (`building_id`) REFERENCES `Building`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_user_id_User_id_fk` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Room_Amenity` ADD CONSTRAINT `Room_Amenity_room_id_Room_id_fk` FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Room_Amenity` ADD CONSTRAINT `Room_Amenity_building_id_Building_id_fk` FOREIGN KEY (`building_id`) REFERENCES `Building`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Room_Amenity` ADD CONSTRAINT `Room_Amenity_amenity_id_Amenity_id_fk` FOREIGN KEY (`amenity_id`) REFERENCES `Amenity`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Room` ADD CONSTRAINT `Room_building_id_Building_id_fk` FOREIGN KEY (`building_id`) REFERENCES `Building`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `User_Email` ADD CONSTRAINT `User_Email_user_id_User_id_fk` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `User_Notification_Preference` ADD CONSTRAINT `User_Notification_Preference_user_id_User_id_fk` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `User_PhoneNumber` ADD CONSTRAINT `User_PhoneNumber_user_id_User_id_fk` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE no action;