import { cookies } from "next/headers";
import axios from "axios";
import Session from "@/lib/session";
import { redirect } from "next/navigation";

export default async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    redirect("/login");
    return null;
  }

  try {
    await axios.get("http://localhost:3000/api/auth", {
      params: { sessionId },
    });

    return new Session(sessionId);
  } catch (err) {
    redirect("/login");
    return null;
  }
}
