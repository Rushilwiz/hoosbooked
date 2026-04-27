import { NextResponse } from "next/server";
import { deleteRoom, getRoomById, updateRoom } from "@/db/queries";
import { badRequest, notFound, parseInteger, readJson } from "../../_utils";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const roomId = parseInteger(id);
  if (roomId === null) return badRequest("invalid room id");

  const room = await getRoomById(roomId);
  if (!room) return notFound("room not found");

  return NextResponse.json(room);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const roomId = parseInteger(id);
  if (roomId === null) return badRequest("invalid room id");

  const { number, buildingId, building_id, capacity } = await readJson(req);

  const roomNumber = parseInteger(number);
  const building = parseInteger(buildingId ?? building_id);
  const roomCapacity = parseInteger(capacity);

  if (roomNumber === null) return badRequest("number is required");
  if (building === null) return badRequest("buildingId is required");
  if (roomCapacity === null) return badRequest("capacity is required");

  const existing = await getRoomById(roomId);
  if (!existing) return notFound("room not found");

  await updateRoom(roomId, roomNumber, building, roomCapacity);

  return NextResponse.json({
    id,
    number: roomNumber,
    building_id: building,
    capacity: roomCapacity,
  });
}

export const PATCH = PUT;

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const roomId = parseInteger(id);
  if (roomId === null) return badRequest("invalid room id");

  const existing = await getRoomById(roomId);
  if (!existing) return notFound("room not found");

  await deleteRoom(roomId);

  return new NextResponse(null, { status: 204 });
}
