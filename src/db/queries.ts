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
  ScheduleBooking,
  DayOpenHours,
  BuildingCoordinates,
} from "@/types/db";

// `User` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `username` varchar(255) NOT NULL UNIQUE,
//   `password` varchar(255) NOT NULL,
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   PRIMARY KEY (`id`),
// );

export const getUserById = async (id: number) => {
  const [rows] = await pool.execute<(User & RowDataPacket)[]>(
    "SELECT id, username, password, created_at FROM `User` WHERE id = ? LIMIT 1",
    [id],
  );
  return rows[0] ?? null;
};

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

export const deleteUser = async (id: number) => {
  await pool.execute("DELETE FROM `User` WHERE id = ?", [id]);
};

export const updateUserPassword = async (
  id: number,
  newPasswordHash: string,
) => {
  await pool.execute("UPDATE `User` SET password = ? WHERE id = ?", [
    newPasswordHash,
    id,
  ]);
};

// `User_Email` (
//   `user_id` varchar(255) NOT NULL,
//   `email` varchar(255) NOT NULL
// );

export const getUserEmailByUserId = async (userId: number) => {
  const [rows] = await pool.execute<UserEmail & RowDataPacket[]>(
    "SELECT user_id, email FROM User_Email WHERE user_id = ?",
    [userId],
  );
  return rows[0] ?? null;
};

export const setUserEmail = async (userId: number, email: string) => {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO User_Email (user_id, email) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE email = VALUES(email)`,
    [userId, email],
  );
  return result.insertId;
};

export const deleteUserEmail = async (userId: number) => {
  await pool.execute("DELETE FROM User_Email WHERE user_id = ?", [userId]);
};

// `User_Notification_Preference` (
//   `user_id` varchar(255) NOT NULL,
//   `notify_by_mail` tinyint(1) NOT NULL DEFAULT 1,
//   `notify_by_text` tinyint(1) NOT NULL DEFAULT 1,
//   PRIMARY KEY (`user_id`)
// );

export const getUserNotificationPreferenceByUserId = async (userId: number) => {
  const [rows] = await pool.execute<
    UserNotificationPreference & RowDataPacket[]
  >(
    "SELECT user_id, notify_by_mail, notify_by_text FROM User_Notification_Preference WHERE user_id = ?",
    [userId],
  );
  return rows[0] ?? null;
};

export const setUserNotificationPreference = async (
  userId: number,
  notifyByMail: boolean,
  notifyByText: boolean,
) => {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO User_Notification_Preference (user_id, notify_by_mail, notify_by_text)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE notify_by_mail = VALUES(notify_by_mail), notify_by_text = VALUES(notify_by_text)`,
    [userId, notifyByMail ? 1 : 0, notifyByText ? 1 : 0],
  );
  return result.insertId;
};

// `User_PhoneNumber` (
//   `user_id` varchar(255) NOT NULL,
//   `phone` varchar(20) NOT NULL
// );

export const getUserPhoneNumberByUserId = async (userId: number) => {
  const [rows] = await pool.execute<UserPhoneNumber & RowDataPacket[]>(
    "SELECT user_id, phone FROM User_PhoneNumber WHERE user_id = ?",
    [userId],
  );
  return rows[0] ?? null;
};

export const setUserPhoneNumber = async (userId: number, phone: string) => {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO User_PhoneNumber (user_id, phone) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE phone = VALUES(phone)`,
    [userId, phone],
  );
  return result.insertId;
};

export const deleteUserPhoneNumber = async (userId: number) => {
  await pool.execute("DELETE FROM User_PhoneNumber WHERE user_id = ?", [
    userId,
  ]);
};

// `Amenity` (
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

// `Room_Amenity` (
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
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO Room_Amenity (room_id, building_id, amenity_id) VALUES (?, ?, ?)",
    [roomId, buildingId, amenityId],
  );
  return result.insertId;
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

// `Building` (
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
  await pool.execute("UPDATE Building SET name = ?, address = ? WHERE id = ?", [
    name,
    address,
    id,
  ]);
};

// `Building_Coordinates` (
//   `building_id` int NOT NULL,
//   `latitude` decimal(10, 8) NOT NULL,
//   `longitude` decimal(11, 8) NOT NULL,
//   PRIMARY KEY (building_id),
//   FOREIGN KEY (building_id) REFERENCES Building (id) ON DELETE CASCADE
// );

export const getCoordinatesByBuildingId = async (buildingId: number) => {
  const [rows] = await pool.execute<BuildingCoordinates & RowDataPacket[]>(
    "SELECT building_id, latitude, longitude FROM Building_Coordinates WHERE building_id = ?",
    [buildingId],
  );
  return rows[0] ?? null;
};

export const getAllBuildingCoordinates = async () => {
  const [rows] = await pool.query(
    "SELECT building_id, latitude, longitude FROM Building_Coordinates",
  );
  return rows as BuildingCoordinates[];
};

// `Room` (
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

// `Booking` (
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

export const getBookingsByUserId = async (userId: number) => {
  const [rows] = await pool.execute<(Booking & RowDataPacket)[]>(
    "SELECT booking_id, purpose, start_time, end_time, date, participants, room_id, building_id, user_id FROM Booking WHERE user_id = ?",
    [userId],
  );
  return rows;
};

export const getBookingById = async (bookingId: string) => {
  const [rows] = await pool.execute<Booking & RowDataPacket[]>(
    "SELECT booking_id, purpose, start_time, end_time, date, participants, room_id, building_id, user_id FROM Booking WHERE booking_id = ?",
    [bookingId],
  );
  return rows[0] ?? null;
};

export const deleteBooking = async (bookingId: string) => {
  await pool.execute("DELETE FROM Booking WHERE booking_id = ?", [bookingId]);
};

export const updateBooking = async (
  bookingId: string,
  purpose: string | null,
  startTime: string,
  endTime: string,
  date: string,
  participants: number | null,
  roomId: number,
  buildingId: number,
) => {
  await pool.execute(
    `UPDATE Booking
     SET purpose = ?, start_time = ?, end_time = ?, date = ?, participants = ?, room_id = ?, building_id = ?
     WHERE booking_id = ?`,
    [
      purpose ?? null,
      startTime,
      endTime,
      date,
      participants ?? null,
      roomId,
      buildingId,
      bookingId,
    ],
  );
};

export const createBooking = async (
  bookingId: string,
  purpose: string | null,
  startTime: string,
  endTime: string,
  date: string,
  participants: number | null,
  roomId: number,
  buildingId: number,
  userId: number,
) => {
  await pool.execute(
    `INSERT INTO Booking (booking_id, purpose, start_time, end_time, date, participants, room_id, building_id, user_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      bookingId,
      purpose ?? null,
      startTime,
      endTime,
      date,
      participants ?? null,
      roomId,
      buildingId,
      userId,
    ],
  );

  return bookingId;
};

// `Notifications` (
//   `notification_id` varchar(255) NOT NULL,
//   `user_id` varchar(255) NOT NULL,
//   `message` text NOT NULL,
//   `viewed` tinyint(1) NOT NULL DEFAULT 0,
//   `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//   PRIMARY KEY (`notification_id`)
// );

export const getNotificationsByUserId = async (userId: number) => {
  const [rows] = await pool.execute<Notification & RowDataPacket[]>(
    "SELECT notification_id, user_id, message, viewed, created_at FROM Notifications WHERE user_id = ?",
    [userId],
  );
  return rows;
};

export const createNotification = async (
  notificationId: string,
  userId: number,
  message: string,
) => {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO Notifications (notification_id, user_id, message) VALUES (?, ?, ?)",
    [notificationId, userId, message],
  );
  return result.insertId;
};

export const markNotificationAsViewed = async (
  notificationId: string,
  userId: number,
) => {
  await pool.execute(
    "UPDATE Notifications SET viewed = 1 WHERE notification_id = ? AND user_id = ?",
    [notificationId, userId],
  );
};

export const deleteNotification = async (
  notificationId: string,
  userId: number,
) => {
  await pool.execute(
    "DELETE FROM Notifications WHERE notification_id = ? AND user_id = ?",
    [notificationId, userId],
  );
};

// `Open_Hours` (
//   `building_id` int(11) NOT NULL,
//   `day` varchar(255) NOT NULL,
//   `open_time` timestamp NOT NULL,
//   `closing_time` timestamp NOT NULL
// );

export const getOpenHoursByBuildingId = async (buildingId: number) => {
  const [rows] = await pool.execute<OpenHours & RowDataPacket[]>(
    "SELECT building_id, day, open_time, closing_time FROM Open_Hours WHERE building_id = ?",
    [buildingId],
  );
  return rows;
};

export const setOpenHours = async (
  buildingId: number,
  day: string,
  openTime: string,
  closingTime: string,
) => {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO Open_Hours (building_id, day, open_time, closing_time)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE open_time = VALUES(open_time), closing_time = VALUES(closing_time)`,
    [buildingId, day, openTime, closingTime],
  );
  return result.insertId;
};

export const deleteOpenHours = async (buildingId: number, day: string) => {
  await pool.execute(
    "DELETE FROM Open_Hours WHERE building_id = ? AND day = ?",
    [buildingId, day],
  );
};

export const getRoomsFiltered = async (
  buildingId: number,
  filters: { minCapacity?: number; amenityIds?: number[] } = {},
) => {
  const params: (string | number)[] = [buildingId];
  let query = `SELECT r.id, r.number, r.building_id, r.capacity FROM Room r WHERE r.building_id = ?`;

  if (filters.minCapacity != null) {
    query += ` AND r.capacity >= ?`;
    params.push(filters.minCapacity);
  }

  if (filters.amenityIds && filters.amenityIds.length > 0) {
    const placeholders = filters.amenityIds.map(() => "?").join(",");
    query += ` AND (SELECT COUNT(DISTINCT ra.amenity_id) FROM Room_Amenity ra WHERE ra.room_id = r.id AND ra.building_id = r.building_id AND ra.amenity_id IN (${placeholders})) = ?`;
    params.push(...filters.amenityIds, filters.amenityIds.length);
  }

  const [rows] = await pool.execute<(Room & RowDataPacket)[]>(query, params);
  return rows;
};

export const getAmenitiesForRooms = async (
  buildingId: number,
  roomIds: number[],
) => {
  if (roomIds.length === 0) return [];
  const placeholders = roomIds.map(() => "?").join(",");
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT ra.room_id, a.id, a.name, a.description FROM Room_Amenity ra JOIN Amenity a ON a.id = ra.amenity_id WHERE ra.building_id = ? AND ra.room_id IN (${placeholders})`,
    [buildingId, ...roomIds],
  );
  return rows as {
    room_id: number;
    id: number;
    name: string;
    description: string | null;
  }[];
};

export const getBookingsByRoomAndDate = async (
  roomId: number,
  buildingId: number,
  date: string,
): Promise<ScheduleBooking[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT booking_id,
            TIME_FORMAT(TIME(start_time), '%H:%i') AS start_time,
            TIME_FORMAT(TIME(end_time),   '%H:%i') AS end_time,
            purpose
     FROM Booking
     WHERE room_id = ? AND building_id = ? AND DATE= ?
     ORDER BY start_time`,
    [roomId, buildingId, date],
  );
  return rows as ScheduleBooking[];
};

export const getOpenHoursForDay = async (
  buildingId: number,
  day: string,
): Promise<DayOpenHours> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT TIME_FORMAT(TIME(open_time),    '%H:%i') AS open_time,
            TIME_FORMAT(TIME(closing_time), '%H:%i') AS closing_time
     FROM Open_Hours
     WHERE building_id = ? AND day = ?
     LIMIT 1`,
    [buildingId, day],
  );
  return (rows[0] as DayOpenHours) ?? null;
};

export const getCurrentBookingForRoom = async (roomId: number) => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT b.booking_id, b.purpose, b.start_time, b.end_time, b.participants, b.user_id
     FROM Booking b
     WHERE b.room_id = ?
       AND TIME(b.start_time) <= (UTC_TIMESTAMP() - INTERVAL 4 HOUR)
       AND TIME(b.end_time)   >  (UTC_TIMESTAMP() - INTERVAL 4 HOUR)
     LIMIT 1;`,
    [roomId],
  );
  return rows[0] ?? null;
};

export const getBookedRoomIds = async (
  buildingId: number,
  roomIds: number[],
  date: string,
  startTime: string,
  endTime: string,
) => {
  if (roomIds.length === 0) return new Set<number>();
  const placeholders = roomIds.map(() => "?").join(",");
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT DISTINCT b.room_id FROM Booking b WHERE b.building_id = ? AND b.room_id IN (${placeholders}) AND DATE(b.date) = ? AND TIME(b.start_time) < ? AND TIME(b.end_time) > ?`,
    [buildingId, ...roomIds, date, endTime, startTime],
  );
  return new Set((rows as { room_id: number }[]).map((r) => r.room_id));
};

// `Rating` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `room_id` int(11) NOT NULL,
//   `building_id` int(11) NOT NULL,
//   `user_id` varchar(255) NOT NULL,
//   `value` int(11) NOT NULL,
//   `description` text DEFAULT NULL,
//   PRIMARY KEY (`id`)
// );

export const getRatingsByRoomId = async (
  roomId: number,
  buildingId: number,
) => {
  const [rows] = await pool.execute<Rating & RowDataPacket[]>(
    "SELECT id, room_id, building_id, user_id, value, description FROM Rating WHERE room_id = ? AND building_id = ?",
    [roomId, buildingId],
  );
  return rows;
};

export const createRating = async (
  roomId: number,
  buildingId: number,
  userId: number,
  value: number,
  description?: string,
) => {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO Rating (room_id, building_id, user_id, value, description) VALUES (?, ?, ?, ?, ?)",
    [roomId, buildingId, userId, value, description ?? null],
  );
  return result.insertId;
};

export const deleteRating = async (id: number) => {
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM Rating WHERE id = ?",
    [id],
  );

  return result.affectedRows > 0;
};

export const updateRating = async (
  id: number,
  roomId: number,
  buildingId: number,
  userId: number,
  value: number,
  description?: string,
) => {
  await pool.execute(
    "UPDATE Rating SET room_id = ?, building_id = ?, user_id = ?, value = ?, description = ? WHERE id = ?",
    [roomId, buildingId, userId, value, description ?? null, id],
  );
};

// check if a user has already rated a room
export const checkRatingExists = async (
  roomId: number,
  buildingId: number,
  userId: number,
) => {
  const [rows] = await pool.execute<Rating & RowDataPacket[]>(
    "SELECT id FROM Rating WHERE room_id = ? AND building_id = ? AND user_id = ?",
    [roomId, buildingId, userId],
  );
  return (rows ?? []).length > 0;
};
