"use client";
import useSession from "@/hooks/useSession";
import Server from "@/types/server";
import { useEffect, useState } from "react";

export default function ServerPage() {
  const session = useSession();
  const [server, setServer] = useState<Server | undefined>();

  useEffect(() => {
    session?.getServerIndex(0).then((s) => {
      setServer(s.data);
    });
  }, [session]);

  return <h1>{JSON.stringify(server)}</h1>;
}
