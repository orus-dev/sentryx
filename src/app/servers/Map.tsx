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
import ServerComponent, { UsageBar } from "../dashboard/server";
import { Cpu, HardDrive, MapPin, MemoryStick, Network } from "lucide-react";

export default function Map({ servers }: { servers: Server[] }) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const [sheet, setSheet] = useState<Server | undefined>();

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
    servers.forEach((server) => {
      if (server.coordinates) {
        const marker = new maplibregl.Marker({ color: "#ff3e00" })
          .setLngLat(server.coordinates)
          .addTo(map.current!);

        marker.getElement().addEventListener("click", () => {
          setSheet(server);
        });

        markers.current.push(marker);
      }
    });
  }, [servers]);

  return (
    <div ref={mapContainer} className="w-full h-full">
      <Sheet open={sheet != undefined} onOpenChange={() => setSheet(undefined)}>
        {sheet && (
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{sheet.name}</SheetTitle>
              <SheetDescription className="flex gap-2">
                {sheet.status[0].toUpperCase() + sheet.status.slice(1)} {" · "}
                {sheet.ip}
                {sheet.location && (
                  <span className="flex items-center gap-0.5">
                    <MapPin size={14} />
                    {sheet.location}
                  </span>
                )}
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 gap-4 flex flex-col">
              <UsageBar
                value={sheet.cpu}
                Icon={Cpu}
                text="CPU"
                color="var(--chart-2)"
              />
              <UsageBar
                value={sheet.memory}
                Icon={MemoryStick}
                text="Memory"
                color="var(--chart-1)"
              />
              <UsageBar
                value={sheet.storage}
                Icon={HardDrive}
                text="Storage"
                color="var(--chart-5)"
              />
              <UsageBar
                value={sheet.network}
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
