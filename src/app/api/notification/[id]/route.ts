import { NextResponse } from "next/server";
import { deleteNotification, markNotificationAsViewed } from "@/db/queries";
import type { RouteContext } from "../../_utils";

async function notificationId(context: RouteContext) {
  const { id } = await context.params;
  return id;
}

export async function PATCH(_req: Request, context: RouteContext) {
  const id = await notificationId(context);

  await markNotificationAsViewed(id);

  return NextResponse.json({
    notification_id: id,
    viewed: 1,
  });
}

export async function PUT(req: Request, context: RouteContext) {
  return PATCH(req, context);
}

export async function DELETE(_req: Request, context: RouteContext) {
  const id = await notificationId(context);

  await deleteNotification(id);

  return new NextResponse(null, { status: 204 });
}
