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

export default function NewServerDialog({
  session,
}: {
  session: Session | null;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [location, setLocation] = useState<[number, number] | undefined>(
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
        <Label className="mt-2">Server Name</Label>
        <Input
          placeholder="Main Server, Database, etc"
          onInput={(e) => setName(e.currentTarget.value)}
        />

        <Label className="mt-2">Server IP</Label>
        <Input
          placeholder="10.7.1.10, etc"
          onInput={(e) => setIp(e.currentTarget.value)}
        />

        <Label className="mt-2">Server Location</Label>
        <MapSelect setLocation={setLocation} />
        <DialogFooter>
          <Button
            onClick={() => {
              session?.addServer({ name, ip, coordinates: location });
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
