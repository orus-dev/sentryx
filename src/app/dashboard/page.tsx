import getSession from "@/hooks/getSession";

export default async function Dashboard() {
  const session = await getSession();
  return (
    <h1>test</h1>
  )
}
