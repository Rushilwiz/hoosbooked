import { NextResponse } from "next/server";
import { deleteAmenity, getAmenityById, updateAmenity } from "@/db/queries";
import {
  badRequest,
  notFound,
  parseIdParam,
  readJson,
  type RouteContext,
} from "../../_utils";

export async function GET(_req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid amenity id");

  const amenity = await getAmenityById(id);
  if (!amenity) return notFound("amenity not found");

  return NextResponse.json(amenity);
}

export async function PUT(req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid amenity id");

  const { name, description } = await readJson(req);

  if (typeof name !== "string" || name.trim().length === 0) {
    return badRequest("name is required");
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return badRequest("description must be a string");
  }

  const existing = await getAmenityById(id);
  if (!existing) return notFound("amenity not found");

  await updateAmenity(id, name.trim(), description ?? undefined);

  return NextResponse.json({
    id,
    name: name.trim(),
    description: description ?? null,
  });
}

export const PATCH = PUT;

export async function DELETE(_req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid amenity id");

  const existing = await getAmenityById(id);
  if (!existing) return notFound("amenity not found");

  await deleteAmenity(id);

  return new NextResponse(null, { status: 204 });
}
