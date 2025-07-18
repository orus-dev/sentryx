import { NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import validate from "../auth/auth";
import { currentServers, servers } from "../servers/servers";

function average<T>(values: Array<T>, p: (v: T) => number) {
  return values.length > 0
    ? values.reduce((sum, value) => sum + p(value), 0) / values.length
    : 0;
}

const usageData = Array.from({length: 60}).map((_, i) => ({ hour: i, cpu: 0, ram: 0 }));
var i = 0;

setInterval(() => {
  if (i > 59) {
    usageData.shift();
    usageData.push({
      hour: i,
      cpu: average(currentServers, (server) => server.cpu),
      ram: average(currentServers, (server) => server.memory)
    });
  } else {
    usageData[i] = {
      hour: i,
      cpu: average(currentServers, (server) => server.cpu),
      ram: average(currentServers, (server) => server.memory)
    };
    i++;
  }
}, 60000);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (!validate(searchParams.get("sessionId")))
    return NextResponse.json(
      { message: "Invalid session" },
      { status: HttpStatusCode.Unauthorized }
    );

  const peakData = [];

  for (let i = 0; i < 60; i += 6) {
    const slice = usageData.slice(i, i + 6);

    const maxCpu = Math.max(...slice.map((entry) => entry.cpu));
    const maxRam = Math.max(...slice.map((entry) => entry.ram));

    peakData.push({
      hour: slice[0].hour,
      cpu: maxCpu,
      ram: maxRam
    });
  }

  return NextResponse.json({
    message: "ok",
    data: peakData,
  });
}