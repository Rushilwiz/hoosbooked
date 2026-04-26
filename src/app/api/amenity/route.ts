import { NextResponse } from "next/server";
import { createAmenity, getAllAmenities } from "@/db/queries";
import { badRequest, readJson } from "../_utils";

export async function GET() {
  const amenities = await getAllAmenities();
  return NextResponse.json(amenities);
}

export async function POST(req: Request) {
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
    { status: 201 }
  );
}
