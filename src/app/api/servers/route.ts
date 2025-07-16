import { NextResponse } from "next/server";
import Data from "../data";
import { ServerAPI } from "@/types/server";

const servers = new Data<ServerAPI>("sentryx/servers.json", "array");

export async function GET(request: Request) {
  return NextResponse.json({ message: "ok", servers: servers.data });
}
