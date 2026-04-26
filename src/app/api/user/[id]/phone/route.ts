import { NextResponse } from "next/server";
import {
  deleteUserPhoneNumber,
  getUserPhoneNumberByUserId,
  setUserPhoneNumber,
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
  if (id === null) return badRequest("invalid user id");

  const phone = await getUserPhoneNumberByUserId(id);
  if (!phone) return notFound("phone not found");

  return NextResponse.json(phone);
}

export async function PUT(req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid user id");

  const { phone } = await readJson(req);

  if (typeof phone !== "string" || phone.trim().length === 0) {
    return badRequest("phone is required");
  }

  await setUserPhoneNumber(id, phone.trim());

  return NextResponse.json({
    user_id: id,
    phone: phone.trim(),
  });
}

export const POST = PUT;
export const PATCH = PUT;

export async function DELETE(_req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid user id");

  await deleteUserPhoneNumber(id);

  return new NextResponse(null, { status: 204 });
}
