import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Session from "@/lib/session";
import Service from "@/types/service";
import { AppWindowMac } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";

export function UsageBar({
  value,
  Icon,
  text,
  color,
}: {
  value: number;
  Icon: React.ElementType;
  text: string;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="justify-between flex">
        <Label className="text-md flex justify-center">
          <Icon size={16} color={color} /> {text}
        </Label>
        <Label className="text-md">{value}%</Label>
      </div>
      <Progress value={value} />
    </div>
  );
}

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${size} ${sizes[i]}`;
}

export function ByteUnit({
  value,
  Icon,
  text,
  color,
}: {
  value: number;
  Icon: React.ElementType;
  text: string;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="justify-between flex">
        <Label className="text-md flex justify-center">
          <Icon size={16} color={color} /> {text}
        </Label>
        <Label className="text-md">{formatBytes(value)}</Label>
      </div>
    </div>
  )
}

export default function ServiceComponent({
  service,
  index,
  session,
}: {
  service: Service;
  index: number;
  session: Session | null;
}) {
  const [deleteAlert, setDeleteAlert] = useState(false);

  return (
    <Card
      className="w-full transition-transform duration-500 hover:scale-102 hover:cursor-pointer !select-none"
      onClick={() => {
        redirect(`/servers/${index}`);
      }}
    >
      <CardHeader>
        <div className="flex items-center gap-2 overflow-clip">
          <div className="bg-muted text-muted-foreground p-1.5 rounded-md">
            <AppWindowMac className="w-4.5 h-4.5 text-current my-auto" />
          </div>
          <div>
            <CardTitle>{service.name}</CardTitle>

            {(service.description && <CardDescription className="flex justify-between">
              {service.description} {(service as any).cpu}
            </CardDescription>)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="w-full flex flex-col gap-3.5">
      </CardContent>
    </Card>
  );
}
