import getSession from "@/hooks/getSession";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }
  return <div>Redirecting..</div>;
}
