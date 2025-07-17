"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CircleCheckBig, Cpu, HardDrive, MemoryStick, Network, TriangleAlert } from "lucide-react";
import { ChartAreaGradient } from "./chart";
import { Progress } from "@/components/ui/progress";
import getSession from "@/hooks/getSession";
import ServerComponent, { ByteUnit, UsageBar } from "./server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import useSession from "@/hooks/useSession";
import Server from "@/types/server";
import SummaryCard from "./SummaryCard";

function generateHourlyData() {
  const result = [];
  for (let hour = 24; hour >= 0; hour--) {
    result.push({
      hour: hour,
      cpu: Math.floor(Math.random() * 20 + 30),
      ram: Math.floor(Math.random() * 40 + 40),
    });
  }
  return result;
}

function average<T>(values: Array<T>, p: (v: T) => number) {
  return values.length > 0
    ? values.reduce((sum, value) => sum + p(value), 0) / values.length
    : 0;
}

const d = generateHourlyData();

export default function Dashboard() {
  const session = useSession();
  const [servers, setServers] = useState<Server[]>([]);
  const [searchedServers, setSearchedServers] = useState<Server[]>([]);
  const [serversQuery, setServersQuery] = useState("");
  const [serverData, setServerData] = useState({
    online: 0,
    issues: 0,
    cpu: 0,
    memory: 0,
    storage: 0,
    network: 0,
  });

  const getServers = () => {
    if (!session) return;

    session.getServers().then((servers) => {
      setServers(servers);
      setServerData({
        online: servers.reduce(
          (sum, server) => (server.status == "online" ? sum + 1 : sum),
          0
        ),
        issues: servers.reduce(
          (sum, server) => (server.status == "warning" ? sum + 1 : sum),
          0
        ),
        cpu: average(servers, (s) => s.cpu),
        memory: average(servers, (s) => s.memory),
        storage: average(servers, (s) => s.storage),
        network: servers.reduce((sum, s) => sum + s.network, 0),
      });``
    }).catch((e) => {
      console.error("Error fetching servers:", e);
    })
  };

  useEffect(() => {
    getServers();
    const interval = setInterval(() => {
      getServers();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let tokens = serversQuery.toLowerCase().split(" ");
      setSearchedServers(
        servers.filter((s) =>
          tokens.some(
            (t) => s.name.toLowerCase().includes(t) || s.status.includes(t)
          )
        )
      );
    }, 30);

    return () => clearTimeout(timeout);
  }, [serversQuery, servers]);

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="grid gap-4 w-full grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          className="text-chart-3"
          value={`${serverData.online}`}
          icon={CircleCheckBig}
        >
          <span className="hidden sm:inline">Online Servers</span>
          <span className="inline sm:hidden">Online</span>
        </SummaryCard>
        <SummaryCard
          className="text-chart-4"
          value={`${serverData.issues}`}
          icon={TriangleAlert}
        >
          Issues
        </SummaryCard>
        <SummaryCard
          className="text-chart-2"
          value={`${serverData.cpu}%`}
          icon={Cpu}
        >
          <span className="hidden sm:inline">Avg CPU Usage</span>
          <span className="inline sm:hidden">CPU</span>
        </SummaryCard>
        <SummaryCard
          className="text-chart-1"
          value={`${serverData.memory}%`}
          icon={MemoryStick}
        >
          <span className="hidden sm:inline">Avg Memory Usage</span>
          <span className="inline sm:hidden">Memory</span>
        </SummaryCard>
      </div>

      <div className="w-full flex gap-5 flex-col md:flex-row">
        <div className="h-96 w-full">
          <ChartAreaGradient chartData={d} />
        </div>
        <Card className="h-96">
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 w-full md:w-96">
            <UsageBar
              value={serverData.cpu}
              Icon={Cpu}
              text="CPU"
              color="var(--chart-2)"
            />
            <UsageBar
              value={serverData.memory}
              Icon={MemoryStick}
              text="Memory"
              color="var(--chart-1)"
            />
            <UsageBar
              value={serverData.storage}
              Icon={HardDrive}
              text="Storage"
              color="var(--chart-5)"
            />
            <ByteUnit
              value={serverData.network}
              Icon={Network}
              text="Network"
              color="var(--chart-3)"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-row gap-3">
          <Input
            onInput={(e) => setServersQuery(e.currentTarget.value)}
            placeholder="Search servers by name, location or IP..."
          />
          <Button onClick={() => {}}>Search</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {searchedServers.map((s, i) => (
          <ServerComponent server={s} key={i} index={i} session={session} />
        ))}
      </div>
    </div>
  );
}
