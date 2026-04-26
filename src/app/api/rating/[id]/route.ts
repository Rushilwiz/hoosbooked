import { NextResponse } from "next/server";
import { deleteRating, updateRating } from "@/db/queries";
import {
  badRequest,
  parseIdParam,
  parseInteger,
  readJson,
  type RouteContext,
} from "../../_utils";

export async function PUT(req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid rating id");

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

  await updateRating(
    id,
    roomId,
    buildingId,
    userId,
    value,
    description ?? undefined
  );

  return NextResponse.json({
    id,
    room_id: roomId,
    building_id: buildingId,
    user_id: userId,
    value,
    description: description ?? null,
  });
}

export const PATCH = PUT;

export async function DELETE(_req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid rating id");

  await deleteRating(id);

  return new NextResponse(null, { status: 204 });
}
