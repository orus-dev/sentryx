import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MapSelect from "./LocationSelect";
import { useState } from "react";
import Session from "@/lib/session";
import { toast } from "sonner";

export default function NewServerDialog({
  session,
}: {
  session: Session | null;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [coordinates, setCoordinates] = useState<[number, number] | undefined>(
    undefined
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "default" }))}
        onClick={() => setOpen(true)}
      >
        <Plus className="m-0 p-0" /> New
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Server</DialogTitle>
        </DialogHeader>
        <Label className="mt-2">
          Server Name<span className="text-red-500">*</span>
        </Label>
        <Input
          placeholder="Main Server, Database, etc"
          required
          onInput={(e) => setName(e.currentTarget.value)}
        />

        <Label className="mt-2">
          Server IP<span className="text-red-500">*</span>
        </Label>
        <Input
          placeholder="10.7.1.10, etc"
          required
          onInput={(e) => setIp(e.currentTarget.value)}
        />

        <Label className="mt-2">Server Location Name</Label>
        <Input
          placeholder="Home, Warehouse 1, 4th ave, etc"
          onInput={(e) =>
            setLocation(
              e.currentTarget.value == "" ? undefined : e.currentTarget.value
            )
          }
        />

        <Label className="mt-2">Server Location</Label>
        <MapSelect setLocation={setCoordinates} />
        <DialogFooter>
          <Button
            disabled={name == "" || ip == ""}
            onClick={() => {
              session
                ?.addServer({ name, ip, coordinates, location })
                .then(() => {
                  toast.success(
                    "Server added successfully, refresh to view it"
                  );
                })
                .catch((e) => {
                  toast.error(
                    "Error adding server: " + e.response.data.message
                  );
                });
              setOpen(false);
            }}
          >
            Add server
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
