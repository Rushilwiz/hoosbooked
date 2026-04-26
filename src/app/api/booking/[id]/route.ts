import { NextResponse } from "next/server";
import { deleteBooking, getBookingById, updateBooking } from "@/db/queries";
import {
  badRequest,
  notFound,
  parseInteger,
  readJson,
  type RouteContext,
} from "../../_utils";

async function bookingId(context: RouteContext) {
  const { id } = await context.params;
  return id;
}

export async function GET(_req: Request, context: RouteContext) {
  const id = await bookingId(context);

  const booking = await getBookingById(id);
  if (!booking) return notFound("booking not found");

  return NextResponse.json(booking);
}

export async function PUT(req: Request, context: RouteContext) {
  const id = await bookingId(context);

  const body = await readJson(req);

  const roomId = parseInteger(body.roomId ?? body.room_id);
  const buildingId = parseInteger(body.buildingId ?? body.building_id);

  const { purpose, date, startTime, start_time, endTime, end_time } = body;

  if (roomId === null) return badRequest("roomId is required");
  if (buildingId === null) return badRequest("buildingId is required");
  if (typeof date !== "string") return badRequest("date is required");

  if (typeof (startTime ?? start_time) !== "string") {
    return badRequest("startTime is required");
  }

  if (typeof (endTime ?? end_time) !== "string") {
    return badRequest("endTime is required");
  }

  const existing = await getBookingById(id);
  if (!existing) return notFound("booking not found");

  await updateBooking(
    id,
    typeof purpose === "string" ? purpose : null,
    startTime ?? start_time,
    endTime ?? end_time,
    date,
    roomId,
    buildingId
  );

  return NextResponse.json(await getBookingById(id));
}

export const PATCH = PUT;

export async function DELETE(_req: Request, context: RouteContext) {
  const id = await bookingId(context);

  const existing = await getBookingById(id);
  if (!existing) return notFound("booking not found");

  await deleteBooking(id);

  return new NextResponse(null, { status: 204 });
}
