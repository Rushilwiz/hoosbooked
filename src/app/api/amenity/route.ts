import { NextResponse } from "next/server";
import { createAmenity, getAllAmenities } from "@/db/queries";
import { badRequest, readJson } from "../_utils";
import { auth } from "@/auth";

export const GET = auth(async (req) => {
  const userId = Number(req.auth?.user?.id);
  if (!req.auth || !userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const amenities = await getAllAmenities();
  return NextResponse.json(amenities);
});

export const POST = auth(async (req) => {
  const userId = Number(req.auth?.user?.id);
  if (!req.auth || !userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

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

  const id = await createAmenity(name.trim(), description ?? undefined);

  return NextResponse.json(
    {
      id,
      name: name.trim(),
      description: description ?? null,
    },
    { status: 201 },
  );
});
