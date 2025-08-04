import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils" // optional utility for combining classes

export function FileUpload({setSelected} : {setSelected: (contents: string) => void}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUnsupported, setIsUnsupported] = useState(false)

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return

    setIsUnsupported(!file.name.endsWith('.json'));
    if (isUnsupported) return

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      setSelected(e.target?.result as string)
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex h-32 cursor-pointer items-center justify-center rounded-md border-2 border-dashed transition-colors",
          isDragging ? "border-primary bg-muted" : "border-muted",
          isUnsupported && "border-destructive"
        )}
      >
        <span className="text-muted-foreground">
          {isUnsupported ? "Unsupported file type" : (fileName || "Click or drag file to upload")}
        </span>
      </div>
    </div>
  )
}
