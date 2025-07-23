"use client";
import useSession from "@/hooks/useSession";
import Server from "@/types/server";
import { useEffect, useState } from "react";
import ServiceComponent from "./service";
import ServerComponent from "@/app/dashboard/server";
import Service, { AppService } from "@/types/service";

interface Server2 extends Server {
  services: Service[],
  apps: AppService[],
}

export default function ServerPage(params: { server: string }) {
  const index = parseInt(params.server) || 0;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {server.services.map((a, i) => (
          <ServiceComponent key={i} service={a} index={i} session={session} / >
      ))}
      </div>
    </div>
  );
}
