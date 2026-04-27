import { NextResponse } from "next/server";
import { deleteAmenity, getAmenityById, updateAmenity } from "@/db/queries";
import { badRequest, notFound, parseInteger, readJson } from "../../_utils";
import { auth } from "@/auth";

export const GET = auth(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const userId = Number(req.auth?.user?.id);
    if (!req.auth || !userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const amenityId = parseInteger(id);
    if (amenityId === null) return badRequest("invalid amenity id");

    const amenity = await getAmenityById(amenityId);
    if (!amenity) return notFound("amenity not found");

    return NextResponse.json(amenity);
  },
);

export const PUT = auth(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const userId = Number(req.auth?.user?.id);
    if (!req.auth || !userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const amenityId = parseInteger(id);
    if (amenityId === null) return badRequest("invalid amenity id");

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

    const existing = await getAmenityById(amenityId);
    if (!existing) return notFound("amenity not found");

    await updateAmenity(amenityId, name.trim(), description ?? undefined);

    return NextResponse.json({
      id,
      name: name.trim(),
      description: description ?? null,
    });
  },
);

export const PATCH = PUT;

export const DELETE = auth(async  (
  req,
  context: { params: Promise<{ id: string }> },
) => {
  const userId = Number(req.auth?.user?.id);
  if (!req.auth || !userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await context.params;
  const amenityId = parseInteger(id);
  if (amenityId === null) return badRequest("invalid amenity id");

  const existing = await getAmenityById(amenityId);
  if (!existing) return notFound("amenity not found");

  await deleteAmenity(amenityId);

  return new NextResponse(null, { status: 204 });
});
