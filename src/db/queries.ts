import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "./pool";
import type {
  User,
  Amenity,
  Booking,
  Room,
  Building,
  UserNotificationPreference,
  UserEmail,
  UserPhoneNumber,
  Rating,
  Notification,
  OpenHours,
} from "../types/db";

export const getUserByUsername = async (username: string) => {
  const [rows] = await pool.execute<(User & RowDataPacket)[]>(
    "SELECT id, username, password, created_at FROM `User` WHERE username = ? LIMIT 1",
    [username],
  );
  return rows[0] ?? null;
};

export const createUser = async (username: string, passwordHash: string) => {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO `User` (username, password) VALUES (?, ?)",
    [username, passwordHash],
  );
  return result.insertId;
};

export type NewBooking = {
  bookingId: string;
  userId: number;
  roomId: number;
  buildingId: number;
  date: string;
  startTime: string;
  endTime: string;
  purpose?: string | null;
};

export const createBooking = async (b: NewBooking) => {
  await pool.execute<ResultSetHeader>(
    `INSERT INTO \`Booking\`
       (booking_id, purpose, start_time, end_time, date, room_id, building_id, user_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      b.bookingId,
      b.purpose ?? null,
      b.startTime,
      b.endTime,
      b.date,
      b.roomId,
      b.buildingId,
      b.userId,
    ],
  );
  return b.bookingId;
};

// CREATE TABLE `Amenity` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `name` varchar(255) NOT NULL,
//   `description` varchar(255) DEFAULT NULL,
//   PRIMARY KEY (`id`)
// );

export const getAllAmenities = async () => {
  const [rows] = await pool.query("SELECT id, name, description FROM Amenity");
  return rows as { id: number; name: string; description: string }[];
};

export const getAmenityById = async (id: number) => {
  const [rows] = await pool.execute<Amenity & RowDataPacket[]>(
    "SELECT id, name, description FROM Amenity WHERE id = ?",
    [id],
  );
  return rows[0] ?? null;
};

export const createAmenity = async (name: string, description?: string) => {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO Amenity (name, description) VALUES (?, ?)",
    [name, description ?? null],
  );
  return result.insertId;
};

export const deleteAmenity = async (id: number) => {
  await pool.execute("DELETE FROM Amenity WHERE id = ?", [id]);
};

export const updateAmenity = async (
  id: number,
  name: string,
  description?: string,
) => {
  await pool.execute(
    "UPDATE Amenity SET name = ?, description = ? WHERE id = ?",
    [name, description ?? null, id],
  );
};

// CREATE TABLE `Room_Amenity` (
//   `room_id` int(11) NOT NULL,
//   `building_id` int(11) NOT NULL,
//   `amenity_id` int(11) NOT NULL
// );

export const getAmenityByRoomId = async (
  roomId: number,
  buildingId: number,
) => {
  const [rows] = await pool.execute(
    `SELECT a.id, a.name, a.description
     FROM Room_Amenity ra
     JOIN Amenity a ON ra.amenity_id = a.id
     WHERE ra.room_id = ? AND ra.building_id = ?`,
    [roomId, buildingId],
  );
  return rows;
};

export const addAmenityToRoom = async (
  roomId: number,
  buildingId: number,
  amenityId: number,
) => {
  await pool.execute(
    "INSERT INTO Room_Amenity (room_id, building_id, amenity_id) VALUES (?, ?, ?)",
    [roomId, buildingId, amenityId],
  );
};

export const removeAmenityFromRoom = async (
  roomId: number,
  buildingId: number,
  amenityId: number,
) => {
  await pool.execute(
    "DELETE FROM Room_Amenity WHERE room_id = ? AND building_id = ? AND amenity_id = ?",
    [roomId, buildingId, amenityId],
  );
};

// CREATE TABLE `Building` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `name` varchar(255) NOT NULL,
//   `address` varchar(255) NOT NULL,
//   PRIMARY KEY (`id`)
// );

export const getAllBuildings = async () => {
  const [rows] = await pool.query("SELECT id, name, address FROM Building");
  return rows as { id: number; name: string; address: string }[];
};

export const getBuildingById = async (id: number) => {
  const [rows] = await pool.execute<Building & RowDataPacket[]>(
    "SELECT id, name, address FROM Building WHERE id = ?",
    [id],
  );
  return rows[0] ?? null;
};

export const createBuilding = async (name: string, address: string) => {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO Building (name, address) VALUES (?, ?)",
    [name, address],
  );
  return result.insertId;
};

export const deleteBuilding = async (id: number) => {
  await pool.execute("DELETE FROM Building WHERE id = ?", [id]);
};

export const updateBuilding = async (
  id: number,
  name: string,
  address: string,
) => {
  await pool.execute(
    "UPDATE Building SET name = ?, address = ? WHERE id = ?",
    [name, address, id],
  );
};

// CREATE TABLE `Room` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `number` int(11) NOT NULL,
//   `building_id` int(11) NOT NULL,
//   `capacity` int(11) NOT NULL,
//   PRIMARY KEY (`id`)
// );

export const getRoomsByBuildingId = async (buildingId: number) => {
  const [rows] = await pool.execute<Room & RowDataPacket[]>(
    "SELECT id, number, building_id, capacity FROM Room WHERE building_id = ?",
    [buildingId],
  );
  return rows;
};

export const getRoomById = async (id: number) => {
  const [rows] = await pool.execute<Room & RowDataPacket[]>(
    "SELECT id, number, building_id, capacity FROM Room WHERE id = ?",
    [id],
  );
  return rows[0] ?? null;
};

export const createRoom = async (
  number: number,
  buildingId: number,
  capacity: number,
) => {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO Room (number, building_id, capacity) VALUES (?, ?, ?)",
    [number, buildingId, capacity],
  );
  return result.insertId;
};

export const deleteRoom = async (id: number) => {
  await pool.execute("DELETE FROM Room WHERE id = ?", [id]);
};

export const updateRoom = async (
  id: number,
  number: number,
  buildingId: number,
  capacity: number,
) => {
  await pool.execute(
    "UPDATE Room SET number = ?, building_id = ?, capacity = ? WHERE id = ?",
    [number, buildingId, capacity, id],
  );
};

// CREATE TABLE `Booking` (
//   `booking_id` varchar(255) NOT NULL,
//   `purpose` text DEFAULT NULL,
//   `start_time` timestamp NOT NULL,
//   `end_time` timestamp NOT NULL,
//   `date` timestamp NOT NULL,
//   `room_id` int(11) NOT NULL references `Room` (`id`) ON DELETE CASCADE,
//   `building_id` int(11) NOT NULL references `Building` (`id`) ON DELETE CASCADE,
//   `user_id` varchar(255) NOT NULL references `User` (`id`) ON DELETE CASCADE,
//   PRIMARY KEY (`booking_id`),
//   UNIQUE KEY `unique_booking` (`room_id`,`building_id`,`date`,`start_time`,`end_time`)
// );

// CREATE TABLE `Notifications` (
//   `notification_id` varchar(255) NOT NULL,
//   `user_id` varchar(255) NOT NULL,
//   `message` text NOT NULL,
//   `viewed` tinyint(1) NOT NULL DEFAULT 0,
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   PRIMARY KEY (`notification_id`)
// );

// CREATE TABLE `Open_Hours` (
//   `building_id` int(11) NOT NULL,
//   `day` varchar(255) NOT NULL,
//   `open_time` timestamp NOT NULL,
//   `closing_time` timestamp NOT NULL
// );

// CREATE TABLE `Rating` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `room_id` int(11) NOT NULL,
//   `building_id` int(11) NOT NULL,
//   `user_id` varchar(255) NOT NULL,
//   `value` int(11) NOT NULL,
//   `description` text DEFAULT NULL,
//   PRIMARY KEY (`id`)
// );

// CREATE TABLE `User` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `username` varchar(255) NOT NULL UNIQUE,
//   `password` varchar(255) NOT NULL,
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   PRIMARY KEY (`id`),
// );

// CREATE TABLE `User_Email` (
//   `user_id` varchar(255) NOT NULL,
//   `email` varchar(255) NOT NULL
// );

// CREATE TABLE `User_Notification_Preference` (
//   `user_id` varchar(255) NOT NULL,
//   `notify_by_mail` tinyint(1) NOT NULL DEFAULT 1,
//   `notify_by_text` tinyint(1) NOT NULL DEFAULT 1,
//   PRIMARY KEY (`user_id`)
// );

// CREATE TABLE `User_PhoneNumber` (
//   `user_id` varchar(255) NOT NULL,
//   `phone` varchar(20) NOT NULL
// );
