import { NextResponse } from "next/server";
import {
  deleteOpenHours,
  getBuildingById,
  getOpenHoursByBuildingId,
  setOpenHours,
} from "@/db/queries";
import {
  badRequest,
  notFound,
  parseIdParam,
  readJson,
  type RouteContext,
} from "../../../_utils";

export async function GET(_req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid building id");

  const building = await getBuildingById(id);
  if (!building) return notFound("building not found");

  const hours = await getOpenHoursByBuildingId(id);

  return NextResponse.json(hours);
}

export async function PUT(req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid building id");

  const { day, openTime, open_time, closingTime, closing_time } =
    await readJson(req);

  if (typeof day !== "string" || day.trim().length === 0) {
    return badRequest("day is required");
  }

  if (typeof (openTime ?? open_time) !== "string") {
    return badRequest("openTime is required");
  }

  if (typeof (closingTime ?? closing_time) !== "string") {
    return badRequest("closingTime is required");
  }

  const building = await getBuildingById(id);
  if (!building) return notFound("building not found");

  await setOpenHours(
    id,
    day.trim(),
    openTime ?? open_time,
    closingTime ?? closing_time
  );

  return NextResponse.json({
    building_id: id,
    day: day.trim(),
    open_time: openTime ?? open_time,
    closing_time: closingTime ?? closing_time,
  });
}

export const POST = PUT;
export const PATCH = PUT;

export async function DELETE(req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid building id");

  const url = new URL(req.url);
  const body = await readJson(req);
  const day = body.day ?? url.searchParams.get("day");

  if (typeof day !== "string" || day.trim().length === 0) {
    return badRequest("day is required");
  }

  await deleteOpenHours(id, day.trim());

  return new NextResponse(null, { status: 204 });
}
