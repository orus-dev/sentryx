"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CircleCheckBig, Cpu, MemoryStick, TriangleAlert } from "lucide-react";
import { ChartAreaGradient } from "./chart";
import { Progress } from "@/components/ui/progress";
import getSession from "@/hooks/getSession";
import ServerComponent from "./server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import useSession from "@/hooks/useSession";
import Server from "@/types/server";
import { toast } from "sonner";

export function generateHourlyData() {
  const result = [];
  for (let hour = 24; hour >= 0; hour--) {
    result.push({
      hour: hour,
      cpu: Math.floor(Math.random() * 20 + 30), // random CPU usage between 0-99
      ram: Math.floor(Math.random() * 40 + 40), // random RAM usage between 0-99
    });
  }
  return result;
}

export function SummaryCard({
  children,
  value,
  icon,
  className,
}: {
  children: React.ReactNode;
  value: string;
  icon: React.ElementType;
  className?: string;
}) {
  const Icon = icon;
  return (
    <Card className="h-24 flex flex-row justify-between items-center gap-0 px-6">
      <div className="">
        <Label className="text-md font-bold text-foreground">{children}</Label>
        <Label className={cn("text-2xl font-bold", className)}>{value}</Label>
      </div>
      <Icon className={cn("shrink-0", className)} size={32} />
    </Card>
  );
}

export function Summary({
  value,
  children,
}: {
  value: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="justify-between flex">
        <Label className="text-md">{children}</Label>
        <Label className="text-md">{value}%</Label>
      </div>
      <Progress value={value} />
    </div>
  );
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

  useEffect(() => {
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
        network: average(servers, (s) => s.network),
      });
    });
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
          <CardContent className="flex flex-col gap-6 w-full md:w-96">
            <Summary value={serverData.cpu}>Average CPU</Summary>
            <Summary value={serverData.memory}>Average Memory</Summary>
            <Summary value={serverData.storage}>Storage</Summary>
            <Summary value={serverData.network}>Average Network</Summary>
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
          <ServerComponent
            server={s}
            key={i}
            onDelete={() =>
              session
                ?.removeServer(i)
                .then(() => {
                  toast.info("Server successfully deleted");
                })
                .catch((e) => {
                  console.log(e.response.data.message);
                  toast.error(
                    `Error deleting server: ` + e.response.data.message
                  );
                })
            }
          />
        ))}
      </div>
    </div>
  );
}
