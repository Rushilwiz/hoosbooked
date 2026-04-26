import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createNotification, getNotificationsByUserId } from "@/db/queries";
import { badRequest, parseInteger, readJson } from "../_utils";

export async function GET(req: Request) {
  const userId = parseInteger(new URL(req.url).searchParams.get("userId"));

  if (userId === null) {
    return badRequest("userId query parameter is required");
  }

  const notifications = await getNotificationsByUserId(userId);

  return NextResponse.json(notifications);
}

export async function POST(req: Request) {
  const { userId, user_id, message } = await readJson(req);

  const user = parseInteger(userId ?? user_id);

  if (user === null) return badRequest("userId is required");

  if (typeof message !== "string" || message.trim().length === 0) {
    return badRequest("message is required");
  }

  const notificationId = randomUUID();

  await createNotification(notificationId, user, message.trim());

  return NextResponse.json(
    {
      notification_id: notificationId,
      user_id: user,
      message: message.trim(),
      viewed: 0,
    },
    { status: 201 }
  );
}
