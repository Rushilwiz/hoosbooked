import { NextResponse } from "next/server";
import {
  deleteUserEmail,
  getUserEmailByUserId,
  setUserEmail,
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

  const email = await getUserEmailByUserId(id);
  if (!email) return notFound("email not found");

  return NextResponse.json(email);
}

export async function PUT(req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid user id");

  const { email } = await readJson(req);

  if (typeof email !== "string" || email.trim().length === 0) {
    return badRequest("email is required");
  }

  await setUserEmail(id, email.trim());

  return NextResponse.json({
    user_id: id,
    email: email.trim(),
  });
}

export const POST = PUT;
export const PATCH = PUT;

export async function DELETE(_req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid user id");

  await deleteUserEmail(id);

  return new NextResponse(null, { status: 204 });
}
