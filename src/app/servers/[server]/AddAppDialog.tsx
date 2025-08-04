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
import { useState } from "react";
import Session from "@/lib/session";
import { toast } from "sonner";

export default function AddAppDialog({
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
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Application</DialogTitle>
        </DialogHeader>
        <Label className="mt-2">
          Application Name<span className="text-red-500">*</span>
        </Label>
        <Input
          placeholder="Sentryx chat, My Project, etc"
          required
          onInput={(e) => setName(e.currentTarget.value)}
        />

        <Label className="mt-2">
          Application service<span className="text-red-500">*</span>
        </Label>
        <Input
          placeholder="my-app.service"
          required
          onInput={(e) => setIp(e.currentTarget.value)}
        />

        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={name == "" || ip == ""}
            onClick={() => {
              setOpen(false);
            }}
          >
            Add App
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
