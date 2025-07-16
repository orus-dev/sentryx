import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CircleCheckBig, Cpu, MemoryStick, TriangleAlert } from "lucide-react";
import { ChartAreaGradient } from "./chart";
import { Progress } from "@/components/ui/progress";

export function generateHourlyData() {
  const result = [];
  for (let hour = 24; hour >= 0; hour--) {
    result.push({
      hour: hour,
      cpu: Math.floor(Math.random() * 100), // random CPU usage between 0-99
      ram: Math.floor(Math.random() * 100), // random RAM usage between 0-99
    });
  }
  return result;
}


export function SummaryCard({children, value, icon, className}: {children: React.ReactNode, value: string, icon: React.ElementType, className?: string}) {
  const Icon = icon;
  return (
    <Card className="h-24 flex flex-row items-center">
      <div className="mx-6">
        <Label className="text-md font-bold text-foreground">{children}</Label>
        <Label className={cn("text-2xl font-bold", className)}>{value}</Label>
      </div>
      <Icon className={cn("ml-auto mr-6", className)} size={32} />
    </Card>
  )
}

export function Summary({value, children}: {value: number, children: React.ReactNode}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="justify-between flex">
        <Label className="text-md">{children}</Label>
        <Label className="text-md">{value}%</Label>
      </div>
      <Progress value={value} />
    </div>
  );
}

export default async function Dashboard() {
  // const session = await getSession();
  const d = generateHourlyData();
  return (
    <div className="w-full flex flex-col gap-10">
      <div className="grid gap-4 w-full grid-cols-2 xl:grid-cols-4">
        <SummaryCard className="text-chart-3" value="69" icon={CircleCheckBig}>Online</SummaryCard>
        <SummaryCard className="text-chart-4" value="2" icon={TriangleAlert}>Issues</SummaryCard>
        <SummaryCard className="text-chart-2" value="52%" icon={Cpu}>Avg CPU Usage</SummaryCard>
        <SummaryCard className="text-chart-1" value="37%" icon={MemoryStick}>Avg Memory Usage</SummaryCard>
      </div>

      <div className="w-full h-96 flex gap-5 flex-col md:flex-row">
        <ChartAreaGradient chartData={d} />
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 w-full md:w-96">
            <Summary value={20}>Average CPU Usage</Summary>
            <Summary value={69}>Average Memory Usage</Summary>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
