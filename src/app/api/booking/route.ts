import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createBooking, getBookingsByUserId } from "@/db/queries";
import { badRequest, parseInteger, readJson } from "../_utils";

export async function GET(req: Request) {
  const userId = parseInteger(new URL(req.url).searchParams.get("userId"));

  if (userId === null) {
    return badRequest("userId query parameter is required");
  }

  const bookings = await getBookingsByUserId(userId);

  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const body = await readJson(req);

  const userId = parseInteger(body.userId ?? body.user_id);
  const roomId = parseInteger(body.roomId ?? body.room_id);
  const buildingId = parseInteger(body.buildingId ?? body.building_id);

  const { date, startTime, start_time, endTime, end_time, purpose } = body;

  if (userId === null) return badRequest("userId is required");
  if (roomId === null) return badRequest("roomId is required");
  if (buildingId === null) return badRequest("buildingId is required");
  if (typeof date !== "string") return badRequest("date is required");

  if (typeof (startTime ?? start_time) !== "string") {
    return badRequest("startTime is required");
  }

  if (typeof (endTime ?? end_time) !== "string") {
    return badRequest("endTime is required");
  }

  try {
    const bookingId = await createBooking(
      randomUUID(),
      typeof purpose === "string" ? purpose : null,
      startTime ?? start_time,
      endTime ?? end_time,
      date,
      roomId,
      buildingId,
      userId
    );

    return NextResponse.json(
      {
        bookingId,
        booking_id: bookingId,
      },
      { status: 201 }
    );
  } catch (err) {
    if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "time slot already booked" },
        { status: 409 }
      );
    }

    throw err;
  }
}
