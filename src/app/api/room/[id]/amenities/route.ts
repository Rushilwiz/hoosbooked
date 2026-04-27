import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  addAmenityToRoom,
  getAmenityById,
  getAmenityByRoomId,
  getRoomById,
  removeAmenityFromRoom,
} from "@/db/queries";
import { badRequest, notFound, parseInteger, readJson } from "../../../_utils";

export const GET = auth(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const userId = Number(req.auth?.user?.id);
    if (!req.auth || !userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const roomId = parseInteger(id);
    if (roomId === null) return badRequest("invalid room id");

    const room = await getRoomById(roomId);
    if (!room) return notFound("room not found");

    const amenities = await getAmenityByRoomId(room.id, room.building_id);

    return NextResponse.json(amenities);
  },
);

export const POST = auth(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const userId = Number(req.auth?.user?.id);
    if (!req.auth || !userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const roomId = parseInteger(id);
    if (roomId === null) return badRequest("invalid room id");

    const { amenityId, amenity_id } = await readJson(req);
    const amenity = parseInteger(amenityId ?? amenity_id);

    if (amenity === null) return badRequest("amenityId is required");

    const room = await getRoomById(roomId);
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
      { status: 201 },
    );
  },
);

export const DELETE = auth(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const userId = Number(req.auth?.user?.id);
    if (!req.auth || !userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const roomId = parseInteger(id);
    if (roomId === null) return badRequest("invalid room id");

    const url = new URL(req.url);
    const body = await readJson(req);

    const amenity = parseInteger(
      body.amenityId ??
        body.amenity_id ??
        url.searchParams.get("amenityId") ??
        url.searchParams.get("amenity_id"),
    );

    if (amenity === null) return badRequest("amenityId is required");

    const room = await getRoomById(roomId);
    if (!room) return notFound("room not found");

    await removeAmenityFromRoom(room.id, room.building_id, amenity);

    return new NextResponse(null, { status: 204 });
  },
);
