import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createBooking, getBookingsByUserId } from "@/db/queries";
import { badRequest, parseInteger, readJson } from "../_utils";
import { auth } from "@/auth";

export const GET = auth(async (req) => {
  const userId = Number(req.auth?.user?.id);
  if (!req.auth || !userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const bookings = await getBookingsByUserId(userId);
  return NextResponse.json(bookings);
});

export const POST = auth(async (req) => {
  const userId = Number(req.auth?.user?.id);
  if (!req.auth || !userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await readJson(req);

  const roomId = parseInteger(body.roomId ?? body.room_id);
  const buildingId = parseInteger(body.buildingId ?? body.building_id);

  const {
    date,
    participants,
    startTime,
    start_time,
    endTime,
    end_time,
    purpose,
  } = body;

  console.log({
    body,
    roomId,
    buildingId,
    date,
    participants,
    startTime,
    start_time,
    endTime,
    end_time,
    purpose,
  });

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
      typeof participants === "number" ? participants : null,
      roomId,
      buildingId,
      userId,
    );

    return NextResponse.json(
      {
        booking_id: bookingId,
      },
      { status: 201 },
    );
  } catch (err) {
    if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "time slot already booked" },
        { status: 409 },
      );
    }

    throw err;
  }
});
