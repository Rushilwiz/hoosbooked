import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { deleteUser, updateUserPassword } from "@/db/queries";
import {
  badRequest,
  parseIdParam,
  readJson,
  type RouteContext,
} from "../../_utils";

export async function PATCH(req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid user id");

  const { password } = await readJson(req);

  if (typeof password !== "string" || password.length < 8) {
    return badRequest("password must be at least 8 characters long");
  }

  const hash = await bcrypt.hash(password, 10);

  await updateUserPassword(id, hash);

  return NextResponse.json({ id });
}

export const PUT = PATCH;

export async function DELETE(_req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid user id");

  await deleteUser(id);

  return new NextResponse(null, { status: 204 });
}
