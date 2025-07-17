import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Session from "@/lib/session";

export default function useSession() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const sessionId = Cookies.get("session_id");

    if (sessionId)
      axios
        .get("/api/auth", { params: { sessionId } })
        .then((r) => {
          setSession(new Session(sessionId));
        })
        .catch((e) => {
          console.log(e);
          router.replace("/login");
        });
  }, []);

  return session;
}
