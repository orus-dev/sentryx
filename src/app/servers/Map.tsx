import React, { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Server from "@/types/server";

export default function Map({ servers }: { servers: Server[] }) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);

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

        // Optional: add popup or click event
        marker.getElement().addEventListener("click", () => {
          // Your logic here
          console.log("Clicked on server", server.name);
        });

        markers.current.push(marker);
      }
    });
  }, [servers]);

  return <div ref={mapContainer} style={{ width: "100%", height: "600px" }} />;
}
