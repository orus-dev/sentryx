import { NextResponse } from "next/server";
import Data from "../data";
import Server, { ServerAPI } from "@/types/server";
import { HttpStatusCode } from "axios";

const servers = new Data<ServerAPI[]>("sentryx/servers.json", "array");

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

  if (!body.name || !body.ip)
    return NextResponse.json(
      {
        message: "Invalid body",
      },
      {
        status: HttpStatusCode.BadRequest,
      }
    );

  servers.data.push({
    name: body.name,
    ip: body.ip,
    coordinates: body.coordinates,
  });

  servers.write();

  return NextResponse.json({
    message: "ok",
  });
}
