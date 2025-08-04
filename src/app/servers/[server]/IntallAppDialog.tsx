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
import { HardDriveDownload, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Session from "@/lib/session";
import { toast } from "sonner";
import { FileUpload } from "@/components/FileUpload";

export default function InstallAppDialog({
  session,
}: {
  session: Session | null;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [script, setScript] = useState<{ install?: string } | undefined>({});

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "secondary" }))}
        onClick={() => setOpen(true)}
      >
        <HardDriveDownload className="m-0 p-0" /> Install
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Install Application</DialogTitle>
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
          Application script<span className="text-red-500">*</span>
        </Label>
        <FileUpload setSelected={(contents) => {
          try {
            setScript(JSON.parse(contents))
            console.log(contents)
          } catch {
            setScript(undefined)
          }
        }} />

        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={name == "" || !script || !(script.install)}
            onClick={() => {
              setOpen(false);
            }}
          >
            Install
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
