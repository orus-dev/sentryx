"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CircleCheckBig, Cpu, MemoryStick, TriangleAlert } from "lucide-react";
import { ChartAreaGradient } from "../dashboard/chart";
import { Progress } from "@/components/ui/progress";
import ServerComponent from "../dashboard/server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import useSession from "@/hooks/useSession";
import Server from "@/types/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Map from "./Map";

export default function Servers() {
  const session = useSession();
  const [servers, setServers] = useState<Server[]>([]);
  const [searchedServers, setSearchedServers] = useState<Server[]>([]);
  const [serversQuery, setServersQuery] = useState("");

  useEffect(() => {
    if (!session) return;

    session.getServers().then((servers) => {
      setServers(servers);
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
    <div className="w-full">
      <Tabs defaultValue="grid">
        <TabsList className="mx-auto mb-5">
          <TabsTrigger value="grid">Grid</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="flex flex-col gap-5">
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
              <ServerComponent server={s} key={i} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="map" className="h-full">
          <Map servers={servers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
