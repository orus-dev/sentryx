import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapSelect({
  setLocation,
}: {
  setLocation: (coords: [number, number] | undefined) => void;
}) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "/map_style.json",
      center: [0, 0],
      zoom: 2,
    });

    // Add click handler
    map.current.on("click", (e) => {
      const lngLat = e.lngLat;

      // Save location to state
      setLocation([lngLat.lng, lngLat.lat]);

      // Remove previous marker if any
      if (marker.current) {
        marker.current.remove();
      }

      // Add marker to clicked location
      marker.current = new maplibregl.Marker({ color: "#ff3e00" })
        .setLngLat(lngLat)
        .addTo(map.current!);
    });

    map.current.on("contextmenu", () => {
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
        setLocation(undefined);
      }
    });

    return () => {
      // Clean up marker
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }

      // Clean up map
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <>
      <div ref={mapContainer} style={{ width: "100%", height: "300px" }} />
    </>
  );
}
