import { NextResponse } from "next/server";
import { getBuildingById, getRoomsByBuildingId } from "@/db/queries";
import {
  badRequest,
  notFound,
  parseIdParam,
  type RouteContext,
} from "../../../_utils";

export async function GET(_req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid building id");

  const building = await getBuildingById(id);
  if (!building) return notFound("building not found");

  const rooms = await getRoomsByBuildingId(id);

  return NextResponse.json(rooms);
}
