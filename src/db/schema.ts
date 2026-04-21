import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  int,
  boolean
} from "drizzle-orm/mysql-core";


// CREATE TABLE Room (id INT AUTO_INCREMENT, number INT, building_id INT, capacity INT, PRIMARY KEY (id, building_id), FOREIGN KEY (building_id) REFERENCES Building(id) ON DELETE CASCADE);
export const rooms = mysqlTable("Room", {
  id: int("id").primaryKey().autoincrement(),
  number: int("number").notNull(),
  buildingId: int("building_id").notNull().references(() => buildings.id, { onDelete: "cascade" }),
  capacity: int("capacity").notNull(),
});

// CREATE TABLE Building (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, address VARCHAR(100) NOT NULL);
export const buildings = mysqlTable("Building", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
});

// CREATE TABLE Amenity (id INT AUTO_INCREMENT PRIMARY KEY,  name VARCHAR(50) NOT NULL, description VARCHAR(255));
export const amenities = mysqlTable("Amenity", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
});

// CREATE TABLE Booking (booking_id VARCHAR(50), purpose TEXT, start_time TIME NOT NULL, end_time TIME NOT NULL, date DATE NOT NULL, room_id INT NOT NULL, building_id INT, user_id VARCHAR(7) NOT NULL, PRIMARY KEY (booking_id, room_id, building_id, user_id), FOREIGN KEY (room_id, building_id) REFERENCES Room(id, building_id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES User(computing_id) ON DELETE CASCADE);
export const bookings = mysqlTable("Booking", {
  id: varchar("booking_id", { length: 255 }).primaryKey(),
  purpose: text("purpose"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  date: timestamp("date").notNull(),
  roomId: int("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  buildingId: int("building_id").notNull().references(() => buildings.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
});

// CREATE TABLE User (computing_id VARCHAR(7) PRIMARY KEY, username VARCHAR(100) UNIQUE NOT NULL, hashed_password VARCHAR(255) NOT NULL);
export const users = mysqlTable("User", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


// CREATE TABLE User_Email (computing_id VARCHAR(7), email VARCHAR(255), PRIMARY KEY (computing_id, email), FOREIGN KEY (computing_id) REFERENCES User(computing_id) ON DELETE CASCADE);
export const userEmails = mysqlTable("User_Email", {
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 255 }).notNull(),
});

// CREATE TABLE User_PhoneNumber ( computing_id VARCHAR(7), phone VARCHAR(20), PRIMARY KEY (computing_id, phone), FOREIGN KEY (computing_id) REFERENCES User(computing_id) ON DELETE CASCADE);
export const userPhoneNumbers = mysqlTable("User_PhoneNumber", {
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  phone: varchar("phone", { length: 20 }).notNull(),
});

// CREATE TABLE Notifications ( notification_id VARCHAR(50), computing_id VARCHAR(7), message TEXT, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (notification_id, computing_id), FOREIGN KEY (computing_id) REFERENCES User(computing_id) ON DELETE CASCADE);
export const notifications = mysqlTable("Notifications", {
  id: varchar("notification_id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  seen: boolean("viewed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// CREATE TABLE User_Notification_Preference (computing_id VARCHAR(7) PRIMARY KEY, notify_by_mail BOOLEAN DEFAULT TRUE, notify_by_text BOOLEAN DEFAULT TRUE, FOREIGN KEY (computing_id) REFERENCES User(computing_id) ON DELETE CASCADE);
export const userNotificationPreferences = mysqlTable("User_Notification_Preference", {
  userId: varchar("user_id", { length: 255 }).primaryKey().references(() => users.id, { onDelete: "cascade" }),
  notifyByMail: boolean("notify_by_mail").notNull().default(true),
  notifyByText: boolean("notify_by_text").notNull().default(true),
});

// CREATE TABLE Open_Hours (building_id INT, day VARCHAR(15), open_time TIME, closing_time TIME, PRIMARY KEY (building_id, day, open_time, closing_time), FOREIGN KEY (building_id) REFERENCES Building (id) ON DELETE CASCADE);
export const openHours = mysqlTable("Open_Hours", {
  buildingId: int("building_id").notNull().references(() => buildings.id, { onDelete: "cascade" }),
  day: varchar("day", { length: 255 }).notNull(),
  openTime: timestamp("open_time").notNull(),
  closingTime: timestamp("closing_time").notNull(),
});

// CREATE TABLE Room_Amenity ( room_id INT, building_id INT, amenity_id INT, PRIMARY KEY (room_id, building_id, amenity_id),  FOREIGN KEY (room_id, building_id) REFERENCES Room(id, building_id) ON DELETE CASCADE,  FOREIGN KEY (amenity_id) REFERENCES Amenity(id) ON DELETE CASCADE);
export const roomAmenities = mysqlTable("Room_Amenity", {
  roomId: int("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  buildingId: int("building_id").notNull().references(() => buildings.id, { onDelete: "cascade" }),
  amenityId: int("amenity_id").notNull().references(() => amenities.id, { onDelete: "cascade" }),
});

// CREATE TABLE Rating ( room_id INT, building_id INT, computing_id VARCHAR(7), `value` INT NOT NULL CHECK (`value` > 0 AND `value` < 6), description TEXT, PRIMARY KEY (room_id, building_id, computing_id), FOREIGN KEY (room_id, building_id) REFERENCES Room(id, building_id) ON DELETE CASCADE, FOREIGN KEY (computing_id) REFERENCES User(computing_id) ON DELETE CASCADE);
export const ratings = mysqlTable("Rating", {
  id: int("id").primaryKey().autoincrement(),
  roomId: int("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  buildingId: int("building_id").notNull().references(() => buildings.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  value: int("value").notNull(),
  description: text("description"),
});