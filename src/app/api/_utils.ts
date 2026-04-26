import { NextResponse } from "next/server";

export type RouteContext<T extends Record<string, string> = { id: string }> = {
  params: Promise<T>;
};

export const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status });

export const badRequest = (message = "invalid request") =>
  json({ error: message }, 400);

export const notFound = (message = "not found") =>
  json({ error: message }, 404);

export const parseInteger = (value: unknown) => {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) return Number(value);
  return null;
};

export const parseIdParam = async <T extends Record<string, string>>(
  context: RouteContext<T>,
  key: keyof T & string = "id" as keyof T & string
) => {
  const params = await context.params;
  return parseInteger(params[key]);
};

export const readJson = async (req: Request) => req.json().catch(() => ({}));
