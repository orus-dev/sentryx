"use client";

import useSession from "@/hooks/useSession";
import Server from "@/types/server";
import { useEffect, useState } from "react";
import ServiceComponent from "./service";
import ServerComponent from "@/app/dashboard/server";
import Service, { AppService } from "@/types/service";
import AppComponent from "./AppComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AddAppDialog from "./AddAppDialog";
import InstallAppDialog from "./IntallAppDialog";

interface Server2 extends Server {
  services: Service[],
  apps: AppService[],
}

export default function ClientPage({ serverId }: { serverId: string }) {
  const index = parseInt(serverId) || 0;
  const session = useSession();
  const [server, setServer] = useState<Server2 | undefined>();

  useEffect(() => {
    session?.getServerIndex(index).then((s) => {
      setServer(s.data);
      setInterval(() => {
        session?.getServerIndex(index).then((s) => {
          setServer(s.data);
        });
      }, 1000);
    });
  }, [session]);

  return server && (
    <div className="gap-4 flex flex-col">
      <div>
        <ServerComponent server={server} session={session} index={index} nonInteractive />
      </div>
      <Card>
        <CardHeader className="flex">
          <div>
            <CardTitle>Sentryx Applications</CardTitle>
            <CardDescription>Your Sentryx apps on this server</CardDescription>
          </div>
          <div className="ml-auto w-max flex gap-3">
            <InstallAppDialog session={session} />
            <AddAppDialog session={session} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {server.apps.map((a, i) => {
              const srv = server.services.find(s => s.name === a.service);
              return srv && <AppComponent key={i} service={srv} index={i} app={a} />;
            })}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {server.services.map((a, i) => (
          <ServiceComponent key={i} service={a} index={i} session={session} />
        ))}
      </div>
    </div>
  );
}
