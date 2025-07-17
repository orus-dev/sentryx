import { NextResponse } from "next/server";
import Data from "../data";
import Server, { ServerAPI } from "@/types/server";
import { HttpStatusCode } from "axios";
import { validate } from "../auth/route";

const servers = new Data<ServerAPI[]>("sentryx/servers.json", []);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("s");
  const currentServers = servers.data.map(
    (s) =>
      ({
        ...s,
        status: "online",
        cpu: 20,
        memory: 70,
        storage: 40,
        network: 30,
      } as Server)
  );

  if (query) {
    let tokens = (query || "").toLocaleLowerCase().split(" ");

    console.log(tokens);

    return NextResponse.json({
      message: "ok",
      servers: currentServers.filter((s) =>
        tokens.some(
          (t) => s.name.toLowerCase().includes(t) || s.status.includes(t)
        )
      ),
    });
  }

  return NextResponse.json({
    message: "ok",
    servers: currentServers,
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!validate(body.sessionId))
    return NextResponse.json(
      { message: "Invalid session" },
      { status: HttpStatusCode.Unauthorized }
    );

  if (!body.name || !body.ip)
    return NextResponse.json(
      {
        message: "The name or IP are invalid or empty",
      },
      {
        status: HttpStatusCode.BadRequest,
      }
    );

  servers.data.push({
    name: body.name,
    ip: body.ip,
    coordinates: body.coordinates,
    location: body.location,
  });

  servers.write();

  return NextResponse.json({
    message: "ok",
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  const index = searchParams.get("index");

  if (!validate(sessionId))
    return NextResponse.json(
      { message: "Invalid session" },
      { status: HttpStatusCode.Unauthorized }
    );

  if (!index)
    return NextResponse.json(
      {
        message: "The index is invalid",
      },
      {
        status: HttpStatusCode.BadRequest,
      }
    );

  servers.data.splice(parseInt(index), 1);

  servers.write();

  return NextResponse.json({
    message: "ok",
  });
}
