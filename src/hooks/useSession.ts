import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Session from "@/lib/session";

export default function useSession() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const id = Cookies.get("session_id");

    if (id)
      axios({
        method: "get",
        url: "/api/auth",
        params: { id },
      })
        .then((r) => {
          setSession(new Session(id));
        })
        .catch((e) => {
          console.log(e);
          router.replace("/login");
        });
  });

  return session;
}
