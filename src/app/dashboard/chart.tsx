"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  cpu: {
    label: "CPU",
    color: "var(--chart-2)",
  },
  ram: {
    label: "RAM",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartAreaGradient({chartData}: {chartData: {hour: number, cpu: number, ram: number}[]}) {
  return (
    <Card className="w-full h-96 sm:h-full">
      <CardHeader>
        <CardTitle>CPU & RAM Usage</CardTitle>
        <CardDescription>
          Showing the average CPU and RAM usage over the last 24 hours.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 flex-1 overflow-hidden">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value+"h"}
                height={34}
              />

              <YAxis domain={[0, 200]} tickLine={false} axisLine={false} tickMargin={8} width={34} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillCPU" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-cpu)"
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-cpu)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillRAM" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-ram)"
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-ram)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="ram"
                type="natural"
                fill="url(#fillRAM)"
                fillOpacity={0.4}
                stroke="var(--color-ram)"
                stackId="a"
              />
              <Area
                dataKey="cpu"
                type="natural"
                fill="url(#fillCPU)"
                fillOpacity={0.4}
                stroke="var(--color-cpu)"
                stackId="a"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
