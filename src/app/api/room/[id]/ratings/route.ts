import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  getRatingsByRoomId,
  createRating,
  checkRatingExists,
  deleteRating,
  updateRating,
  getRoomById,
} from "@/db/queries";
import { badRequest, notFound, parseInteger, readJson } from "../../../_utils";
import { get } from "http";

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

    const ratings = await getRatingsByRoomId(room.id, room.building_id);

    return NextResponse.json(ratings);
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

    const room = await getRoomById(roomId);
    if (!room) return notFound("room not found");

    const { value, description } = await readJson(req);
    const ratingValue = parseInteger(value);

    if (ratingValue === null) return badRequest("rating value is required");

    const existingRating = await checkRatingExists(
      room.id,
      room.building_id,
      userId,
    );
    if (existingRating) return badRequest("rating already exists");

    const resId = await createRating(
      room.id,
      room.building_id,
      userId,
      ratingValue,
      description,
    );

    return NextResponse.json(
      {
        id: resId,
        room_id: room.id,
        building_id: room.building_id,
        user_id: userId,
        value: ratingValue,
        description,
      },
      { status: 201 },
    );
  },
);

const PUT = auth(
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

    const { value, description } = await readJson(req);
    const ratingValue = parseInteger(value);

    if (ratingValue === null) return badRequest("rating value is required");

    const existingRating = await getRatingsByRoomId(
      room.id,
      room.building_id,
    ).then((ratings) => (ratings.find((r) => r.user_id === userId) ?? [])[0]);
    if (!existingRating) return notFound("rating not found");

    await updateRating(
      existingRating.id,
      room.id,
      room.building_id,
      userId,
      ratingValue,
      description,
    );

    return NextResponse.json({
      id: existingRating.id,
      room_id: room.id,
      building_id: room.building_id,
      user_id: userId,
      value: ratingValue,
      description,
    });
  },
);

export const PATCH = PUT;

export const DELETE = auth(
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

    const existingRating = await getRatingsByRoomId(
      room.id,
      room.building_id,
    ).then((ratings) => (ratings.find((r) => r.user_id === userId) ?? [])[0]);
    if (!existingRating) return notFound("rating not found");

    await deleteRating(existingRating.id);

    return new NextResponse(null, { status: 204 });
  },
);
