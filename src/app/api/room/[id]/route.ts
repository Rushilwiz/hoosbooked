import { NextResponse } from "next/server";
import { deleteRoom, getRoomById, updateRoom } from "@/db/queries";
import {
  badRequest,
  notFound,
  parseIdParam,
  parseInteger,
  readJson,
  type RouteContext,
} from "../../_utils";

export async function GET(_req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid room id");

  const room = await getRoomById(id);
  if (!room) return notFound("room not found");

  return NextResponse.json(room);
}

export async function PUT(req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid room id");

  const { number, buildingId, building_id, capacity } = await readJson(req);

  const roomNumber = parseInteger(number);
  const building = parseInteger(buildingId ?? building_id);
  const roomCapacity = parseInteger(capacity);

  if (roomNumber === null) return badRequest("number is required");
  if (building === null) return badRequest("buildingId is required");
  if (roomCapacity === null) return badRequest("capacity is required");

  const existing = await getRoomById(id);
  if (!existing) return notFound("room not found");

  await updateRoom(id, roomNumber, building, roomCapacity);

  return NextResponse.json({
    id,
    number: roomNumber,
    building_id: building,
    capacity: roomCapacity,
  });
}

export const PATCH = PUT;

export async function DELETE(_req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid room id");

  const existing = await getRoomById(id);
  if (!existing) return notFound("room not found");

  await deleteRoom(id);

  return new NextResponse(null, { status: 204 });
}
