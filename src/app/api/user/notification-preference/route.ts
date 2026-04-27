import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  getUserNotificationPreferenceByUserId,
  setUserNotificationPreference,
} from "@/db/queries";
import {
  badRequest,
  notFound,
  readJson,
} from "../../_utils";

export const GET = auth(async function GET(req) {
  const id = Number(req.auth?.user?.id);
  if (!req.auth || !id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const preference = await getUserNotificationPreferenceByUserId(id);
  if (!preference) return notFound("notification preference not found");

  return NextResponse.json(preference);
});

export const PUT = auth(async function PUT(req) {
  const id = Number(req.auth?.user?.id);
  if (!req.auth || !id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { notifyByMail, notify_by_mail, notifyByText, notify_by_text } =
    await readJson(req);

  const mail = notifyByMail ?? notify_by_mail;
  const text = notifyByText ?? notify_by_text;

  if (typeof mail !== "boolean") return badRequest("notifyByMail is required");
  if (typeof text !== "boolean") return badRequest("notifyByText is required");

  const resId = await setUserNotificationPreference(id, mail, text);

  return NextResponse.json({
    id: resId,
    user_id: id,
    notify_by_mail: mail ? 1 : 0,
    notify_by_text: text ? 1 : 0,
  });
});

export const POST = PUT;
export const PATCH = PUT;
