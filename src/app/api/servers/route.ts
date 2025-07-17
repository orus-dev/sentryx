import { NextResponse } from "next/server";
import Data from "../data";
import Server, { ServerAPI } from "@/types/server";
import { HttpStatusCode } from "axios";
import { validate } from "../auth/route";

const useServer = (server: ServerAPI, index: number) => {
  const ws = new WebSocket(`ws://${server.ip}:5273`);
  ws.onmessage = (msg) => {
    try {
      if (deletes.has(index) || !currentServers[index]) {
        ws.close();
        return;
      }
      if (msg.data === "Success") {return}
      const data = JSON.parse(msg.data);
      
      if (data.status) {
        currentServers[index].status = data.status;
      }
      if (data.cpu) {
        currentServers[index].cpu = data.cpu;
      }
      if (data.memory) {
        currentServers[index].memory = data.memory;
      }
      if (data.disk) {
        currentServers[index].storage = data.disk;
      }
      if (data.network) {
        currentServers[index].network = data.network;
      }
    } catch (e) {
      console.error("Error parsing WebSocket message:", e);
    }
  };
  ws.onopen = () => ws.send("my-key");
};

const deletes = new Set<number>();
export const servers = new Data<ServerAPI[]>("sentryx/servers.json", []);
export var currentServers: Server[] = servers.data.map(
    (s) =>
      ({
        ...s,
        status: "offline",
        cpu: 0,
        memory: 0,
        storage: 0,
        network: 0,
      } as Server)
  );

servers.data.map(useServer);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("s");
  const sessionId = searchParams.get("sessionId");

  if (!validate(sessionId))
    return NextResponse.json(
      { message: "Invalid session" },
      { status: HttpStatusCode.Unauthorized }
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

  currentServers.push({
    name: body.name,
    ip: body.ip,
    coordinates: body.coordinates,
    location: body.location,
    status: "offline",
    cpu: 0,
    memory: 0,
    storage: 0,
    network: 0,
  });

  useServer({
    name: body.name,
    ip: body.ip,
    coordinates: body.coordinates,
    location: body.location,
  }, servers.data.length - 1);

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
  currentServers.splice(parseInt(index), 1);

  deletes.add(parseInt(index));

  servers.write();

  return NextResponse.json({
    message: "ok",
  });
}
