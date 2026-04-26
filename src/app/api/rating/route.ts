import { NextResponse } from "next/server";
import { createRating, getRatingsByRoomId } from "@/db/queries";
import { badRequest, parseInteger, readJson } from "../_utils";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const roomId = parseInteger(
    url.searchParams.get("roomId") ?? url.searchParams.get("room_id")
  );

  const buildingId = parseInteger(
    url.searchParams.get("buildingId") ?? url.searchParams.get("building_id")
  );

  if (roomId === null) return badRequest("roomId query parameter is required");

  if (buildingId === null) {
    return badRequest("buildingId query parameter is required");
  }

  const ratings = await getRatingsByRoomId(roomId, buildingId);

  return NextResponse.json(ratings);
}

export async function POST(req: Request) {
  const body = await readJson(req);

  const roomId = parseInteger(body.roomId ?? body.room_id);
  const buildingId = parseInteger(body.buildingId ?? body.building_id);
  const userId = parseInteger(body.userId ?? body.user_id);
  const value = parseInteger(body.value);

  const { description } = body;

  if (roomId === null) return badRequest("roomId is required");
  if (buildingId === null) return badRequest("buildingId is required");
  if (userId === null) return badRequest("userId is required");

  if (value === null || value < 1 || value > 5) {
    return badRequest("value must be an integer from 1 to 5");
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return badRequest("description must be a string");
  }

  const id = await createRating(
    roomId,
    buildingId,
    userId,
    value,
    description ?? undefined
  );

  return NextResponse.json(
    {
      id,
      room_id: roomId,
      building_id: buildingId,
      user_id: userId,
      value,
      description: description ?? null,
    },
    { status: 201 }
  );
}
