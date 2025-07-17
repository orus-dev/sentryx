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
import Server from "@/types/server";
import {
  Cpu,
  HardDrive,
  MapPin,
  MemoryStick,
  Network,
  Pencil,
  Trash,
  Wifi,
} from "lucide-react";
import { useState } from "react";

function UsageBar({
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

export default function ServerComponent({
  server,
  onDelete,
}: {
  server: Server;
  onDelete: () => void;
}) {
  const [deleteAlert, setDeleteAlert] = useState(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card className="w-full transition-transform duration-500 hover:scale-102 hover:cursor-pointer">
            <CardHeader>
              <CardTitle>{server.name}</CardTitle>
              <CardDescription className="flex justify-between">
                <div className="flex gap-2">
                  {server.status[0].toUpperCase() + server.status.slice(1)}{" "}
                  {" · "}
                  {server.ip}
                  {server.location && (
                    <div className="flex items-center gap-0.5">
                      <MapPin size={14} />
                      {server.location}
                    </div>
                  )}
                </div>
              </CardDescription>
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
              <UsageBar
                value={server.network}
                Icon={Network}
                text="Network"
                color="var(--chart-3)"
              />
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
              onClick={onDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
