import axios, { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";
import { PORT, servers } from "../servers/servers";
import validate from "../auth/auth";
import Service from "@/types/service";

const allServices: { [key: string]: Service[] } = {};

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

  axios.get(`http://${server.ip}:${PORT}/apps`, {params: {auth: 'my-key'}}).then((apps) => {
    allServices[parseInt(index)] = apps.data;
  });

  return NextResponse.json({
    message: "ok",
    apps: allServices[parseInt(index)] || [],
  });
}
