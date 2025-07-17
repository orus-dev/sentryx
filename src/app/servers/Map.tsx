import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Server from "@/types/server";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ServerComponent, { ByteUnit, UsageBar } from "../dashboard/server";
import {
  Cpu,
  HardDrive,
  MapPin,
  MemoryStick,
  Network,
  ServerIcon,
} from "lucide-react";

export default function Map({ servers }: { servers: Server[] }) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const [sheet, setSheet] = useState<number | undefined>();

  // Initialize map only once
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "/map_style.json",
      center: [0, 0],
      zoom: 2,
    });

    return () => {
      // Clean up markers
      markers.current.forEach((m) => m.remove());
      markers.current = [];

      // Clean up map
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers when servers change
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add new markers
    servers.forEach((server, i) => {
      if (server.coordinates) {
        const marker = new maplibregl.Marker({ color: "#ff3e00" })
          .setLngLat(server.coordinates)
          .addTo(map.current!);

        marker.getElement().addEventListener("click", () => {
          setSheet(i);
        });

        markers.current.push(marker);
      }
    });
  }, [servers]);

  return (
    <div ref={mapContainer} className="w-full h-full">
      <Sheet open={sheet != undefined} onOpenChange={() => setSheet(undefined)}>
        {sheet != undefined && (
          <SheetContent>
            <SheetHeader>
              <div className="flex items-center gap-2">
                <div className="bg-muted text-muted-foreground p-1.5 rounded-md">
                  <ServerIcon className="w-4.5 h-4.5 text-current my-auto" />
                </div>
                <div>
                  <SheetTitle>{servers[sheet].name}</SheetTitle>
                  <SheetDescription className="flex gap-2">
                    {servers[sheet].status[0].toUpperCase() + servers[sheet].status.slice(1)}{" "}
                    {" · "}
                    {servers[sheet].ip}
                    {servers[sheet].location && (
                      <span className="flex items-center gap-0.5">
                        <MapPin size={14} />
                        {servers[sheet].location}
                      </span>
                    )}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>
            <div className="px-4 gap-4 flex flex-col">
              <UsageBar
                value={servers[sheet].cpu}
                Icon={Cpu}
                text="CPU"
                color="var(--chart-2)"
              />
              <UsageBar
                value={servers[sheet].memory}
                Icon={MemoryStick}
                text="Memory"
                color="var(--chart-1)"
              />
              <UsageBar
                value={servers[sheet].storage}
                Icon={HardDrive}
                text="Storage"
                color="var(--chart-5)"
              />
              <ByteUnit
                value={servers[sheet].network}
                Icon={Network}
                text="Network"
                color="var(--chart-3)"
              />
            </div>
          </SheetContent>
        )}
      </Sheet>
    </div>
  );
}
