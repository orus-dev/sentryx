import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function SummaryCard({
  children,
  value,
  icon,
  className,
}: {
  children: React.ReactNode;
  value: string;
  icon: React.ElementType;
  className?: string;
}) {
  const Icon = icon;
  return (
    <Card className="h-24 flex flex-row justify-between items-center gap-0 px-6">
      <div className="">
        <Label className="text-md font-bold text-foreground">{children}</Label>
        <Label className={cn("text-2xl font-bold", className)}>{value}</Label>
      </div>
      <Icon className={cn("shrink-0", className)} size={32} />
    </Card>
  );
}