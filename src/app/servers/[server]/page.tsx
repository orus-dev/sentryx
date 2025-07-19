"use client";
import useSession from "@/hooks/useSession";
import Server from "@/types/server";
import { useEffect, useState } from "react";
import ServiceComponent from "./service";

interface Server2 extends Server {
  apps: { name?: string }[]
}

export default function ServerPage() {
  const session = useSession();
  const [server, setServer] = useState<Server2 | undefined>();

  useEffect(() => {
    session?.getServerIndex(0).then((s) => {
      setServer(s.data);
      setTimeout(() => {
        session?.getServerIndex(0).then((s) => {
          setServer(s.data);
        });
    }, 1000);
    });
  }, [session]);

  return server && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {server.apps.map((a, i) => (
        <ServiceComponent key={i} service={a} index={i} session={session} / >
    ))}
    </div>
  );
}
