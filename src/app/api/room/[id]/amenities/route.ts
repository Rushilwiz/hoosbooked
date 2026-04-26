import { NextResponse } from "next/server";
import {
  addAmenityToRoom,
  getAmenityById,
  getAmenityByRoomId,
  getRoomById,
  removeAmenityFromRoom,
} from "@/db/queries";
import {
  badRequest,
  notFound,
  parseIdParam,
  parseInteger,
  readJson,
  type RouteContext,
} from "../../../_utils";

export async function GET(_req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid room id");

  const room = await getRoomById(id);
  if (!room) return notFound("room not found");

  const amenities = await getAmenityByRoomId(room.id, room.building_id);

  return NextResponse.json(amenities);
}

export async function POST(req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid room id");

  const { amenityId, amenity_id } = await readJson(req);
  const amenity = parseInteger(amenityId ?? amenity_id);

  if (amenity === null) return badRequest("amenityId is required");

  const room = await getRoomById(id);
  if (!room) return notFound("room not found");

  const existingAmenity = await getAmenityById(amenity);
  if (!existingAmenity) return notFound("amenity not found");

  await addAmenityToRoom(room.id, room.building_id, amenity);

  return NextResponse.json(
    {
      room_id: room.id,
      building_id: room.building_id,
      amenity_id: amenity,
    },
    { status: 201 }
  );
}

export async function DELETE(req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid room id");

  const url = new URL(req.url);
  const body = await readJson(req);

  const amenity = parseInteger(
    body.amenityId ??
      body.amenity_id ??
      url.searchParams.get("amenityId") ??
      url.searchParams.get("amenity_id")
  );

  if (amenity === null) return badRequest("amenityId is required");

  const room = await getRoomById(id);
  if (!room) return notFound("room not found");

  await removeAmenityFromRoom(room.id, room.building_id, amenity);

  return new NextResponse(null, { status: 204 });
}
