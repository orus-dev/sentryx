import axios, { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";
import Data, { findKey } from "../data";

const users = new Data<{
  [key: string]: { username: string; password: string };
}>("sentryx/users.json", "object");

const sessions = new Data<{ [key: string]: string }>(
  "sentryx/sessions.json",
  "object"
);

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.username || !body.password)
    return NextResponse.json(
      { message: "Credentials are empty" },
      { status: HttpStatusCode.BadRequest }
    );

  const uuid = findKey(
    users.data,
    (u) => u.username == body.username && u.password == body.password
  );

  if (!uuid) {
    return NextResponse.json(
      { message: "Invalid username or password" },
      { status: HttpStatusCode.BadRequest }
    );
  }

  const sessionId = "SESH-" + crypto.randomUUID();

  sessions.data[sessionId] = String(uuid);

  sessions.write();

  return NextResponse.json({ message: "ok", sessionId });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get("id") || "";

  if (!sessions.data[id])
    return NextResponse.json(
      { message: "Invalid session" },
      { status: HttpStatusCode.Unauthorized }
    );

  return NextResponse.json({ message: "ok" });
}
