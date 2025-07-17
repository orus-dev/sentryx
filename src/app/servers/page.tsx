"use client";

import { Card, CardContent } from "@/components/ui/card";
import ServerComponent from "../dashboard/server";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import useSession from "@/hooks/useSession";
import Server from "@/types/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Map from "./Map";
import NewServerDialog from "./NewServerDialog";

export default function Servers() {
  const session = useSession();
  const [servers, setServers] = useState<Server[]>([]);
  const [searchedServers, setSearchedServers] = useState<Server[]>([]);
  const [serversQuery, setServersQuery] = useState("");

  const getServers = () => {
    if (!session) return;

    session.getServers().then((servers) => {
      setServers(servers);
    });
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
    <div className="w-full h-full">
      <Tabs defaultValue="grid" className="h-full">
        <TabsList className="mx-auto mb-5">
          <TabsTrigger value="grid">Grid</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="flex flex-col gap-5 h-full">
          <Card>
            <CardContent className="flex flex-row gap-3">
              <Input
                onInput={(e) => setServersQuery(e.currentTarget.value)}
                placeholder="Search servers by name, location or IP..."
              />
              <NewServerDialog session={session} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {searchedServers.map((s, i) => (
              <ServerComponent server={s} key={i} index={i} session={session} />
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
