import { NextResponse } from "next/server";
import { createRoom } from "@/db/queries";
import { badRequest, parseInteger, readJson } from "../_utils";

export async function POST(req: Request) {
  const { number, buildingId, building_id, capacity } = await readJson(req);

  const roomNumber = parseInteger(number);
  const building = parseInteger(buildingId ?? building_id);
  const roomCapacity = parseInteger(capacity);

  if (roomNumber === null) return badRequest("number is required");
  if (building === null) return badRequest("buildingId is required");
  if (roomCapacity === null) return badRequest("capacity is required");

  const id = await createRoom(roomNumber, building, roomCapacity);

  return NextResponse.json(
    {
      id,
      number: roomNumber,
      building_id: building,
      capacity: roomCapacity,
    },
    { status: 201 }
  );
}
