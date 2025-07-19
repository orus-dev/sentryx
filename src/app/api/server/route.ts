import axios, { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";
import { servers } from "../servers/servers";
import validate from "../auth/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (!validate(searchParams.get("sessionId")))
    return NextResponse.json(
      { message: "Invalid session" },
      { status: HttpStatusCode.Unauthorized }
    );

  const index = searchParams.get("index");

  if (!index || !servers.data[parseInt(index)])
    return NextResponse.json(
      {
        message: "The index is invalid",
      },
      {
        status: HttpStatusCode.BadRequest,
      }
    );

  const server = servers.data[parseInt(index)];

  const apps = await axios.get(`http://${server.ip}:8080/apps`, {params: {auth: 'my-key'}});

  return NextResponse.json({
    message: "ok",
    apps: apps.data,
  });
}
