export interface Amenity {
  id: number;
  name: string;
  description: string | null;
}

export interface User {
  id: number;
  username: string;
  password: string;
  created_at: Date;
}

export interface Building {
  id: number;
  name: string;
  address: string;
}

export interface Room {
  id: number;
  number: number;
  building_id: number;
  capacity: number;
}

export interface Booking {
  booking_id: string;
  purpose: string | null;
  start_time: Date;
  end_time: Date;
  date: Date;
  room_id: number;
  building_id: number;
  user_id: number;
}

export interface Notification {
  notification_id: string;
  user_id: number;
  message: string;
  viewed: number;
  created_at: Date;
}

export interface OpenHours {
  building_id: number;
  day: string;
  open_time: Date;
  closing_time: Date;
}

export interface Rating {
  id: number;
  room_id: number;
  building_id: number;
  user_id: number;
  value: number;
  description: string | null;
}

export interface RoomAmenity {
  room_id: number;
  building_id: number;
  amenity_id: number;
}

export interface UserEmail {
  user_id: number;
  email: string;
}

export interface UserPhoneNumber {
  user_id: number;
  phone: string;
}

export interface UserNotificationPreference {
  user_id: number;
  notify_by_mail: number;
  notify_by_text: number;
}
