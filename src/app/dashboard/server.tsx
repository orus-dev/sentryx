import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Session from "@/lib/session";
import Server from "@/types/server";
import {
  Cpu,
  HardDrive,
  MapPin,
  MemoryStick,
  Network,
  Pencil,
  ServerIcon,
  Trash,
  Wifi,
} from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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

export default function ServerComponent({
  server,
  index,
  session,
}: {
  server: Server;
  index: number;
  session: Session | null;
}) {
  const [deleteAlert, setDeleteAlert] = useState(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            className="w-full transition-transform duration-500 hover:scale-102 hover:cursor-pointer !select-none"
            onClick={() => {
              redirect(`/servers/${index}`);
            }}
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-muted text-muted-foreground p-1.5 rounded-md">
                  <ServerIcon className="w-4.5 h-4.5 text-current my-auto" />
                </div>
                <div>
                  <CardTitle>{server.name}</CardTitle>
                  <CardDescription className="flex justify-between">
                    <div className="flex gap-2 items-center flex-wrap">
                      {server.status[0].toUpperCase() + server.status.slice(1)}
                      {" · "}
                      {server.ip}
                      {server.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          {server.location}
                        </div>
                      )}
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="w-full flex flex-col gap-3.5">
              <UsageBar
                value={server.cpu}
                Icon={Cpu}
                text="CPU"
                color="var(--chart-2)"
              />
              <UsageBar
                value={server.memory}
                Icon={MemoryStick}
                text="Memory"
                color="var(--chart-1)"
              />
              <UsageBar
                value={server.storage}
                Icon={HardDrive}
                text="Storage"
                color="var(--chart-5)"
              />
              <div className="flex flex-col gap-2 w-full">
                <div className="justify-between flex">
                  <Label className="text-md flex justify-center">
                    <Network size={16} color="var(--chart-3)" /> Network
                  </Label>
                  <Label className="text-md">{formatBytes(server.network)}</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <Pencil className="text-current" />
            Edit
          </ContextMenuItem>
          <ContextMenuItem
            className="text-destructive"
            onClick={() => setDeleteAlert(true)}
          >
            <Trash className="text-current" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <AlertDialog open={deleteAlert} onOpenChange={setDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently remove your server from the server
              list
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="text-destructive-foreground bg-destructive"
              onClick={() =>
                session
                  ?.removeServer(index)
                  .then(() => {
                    toast.info("Server successfully deleted");
                  })
                  .catch((e) => {
                    toast.error(
                      `Error deleting server: ` + e.response.data.message
                    );
                  })
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
