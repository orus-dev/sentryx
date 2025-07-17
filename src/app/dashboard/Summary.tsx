import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export default function Summary({
  value,
  children,
}: {
  value: number;
  children: React.ReactNode;
}) {
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