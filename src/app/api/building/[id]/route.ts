import { NextResponse } from "next/server";
import { deleteBuilding, getBuildingById, updateBuilding } from "@/db/queries";
import {
  badRequest,
  notFound,
  parseIdParam,
  readJson,
  type RouteContext,
} from "../../_utils";

export async function GET(_req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid building id");

  const building = await getBuildingById(id);
  if (!building) return notFound("building not found");

  return NextResponse.json(building);
}

export async function PUT(req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid building id");

  const { name, address } = await readJson(req);

  if (typeof name !== "string" || name.trim().length === 0) {
    return badRequest("name is required");
  }

  if (typeof address !== "string" || address.trim().length === 0) {
    return badRequest("address is required");
  }

  const existing = await getBuildingById(id);
  if (!existing) return notFound("building not found");

  await updateBuilding(id, name.trim(), address.trim());

  return NextResponse.json({
    id,
    name: name.trim(),
    address: address.trim(),
  });
}

export const PATCH = PUT;

export async function DELETE(_req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid building id");

  const existing = await getBuildingById(id);
  if (!existing) return notFound("building not found");

  await deleteBuilding(id);

  return new NextResponse(null, { status: 204 });
}
