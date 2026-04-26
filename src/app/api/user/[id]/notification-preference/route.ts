import { NextResponse } from "next/server";
import {
  getUserNotificationPreferenceByUserId,
  setUserNotificationPreference,
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

  const preference = await getUserNotificationPreferenceByUserId(id);
  if (!preference) return notFound("notification preference not found");

  return NextResponse.json(preference);
}

export async function PUT(req: Request, context: RouteContext) {
  const id = await parseIdParam(context);
  if (id === null) return badRequest("invalid user id");

  const { notifyByMail, notify_by_mail, notifyByText, notify_by_text } =
    await readJson(req);

  const mail = notifyByMail ?? notify_by_mail;
  const text = notifyByText ?? notify_by_text;

  if (typeof mail !== "boolean") return badRequest("notifyByMail is required");
  if (typeof text !== "boolean") return badRequest("notifyByText is required");

  await setUserNotificationPreference(id, mail, text);

  return NextResponse.json({
    user_id: id,
    notify_by_mail: mail ? 1 : 0,
    notify_by_text: text ? 1 : 0,
  });
}

export const POST = PUT;
export const PATCH = PUT;
