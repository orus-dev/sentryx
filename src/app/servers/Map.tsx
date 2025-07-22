import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import Server from '@/types/server';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin } from 'lucide-react';
import ServerComponent from '../dashboard/server';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function ServerMap({ servers }: { servers: Server[] }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ width: 800, height: 600 });

  // 1. Get bounding coordinates
  const coords = useMemo(() => servers
    .map(s => s.coordinates)
    .filter((c): c is [number, number] => !!c), [servers]);

  const center = useMemo(() => {
    if (coords.length === 0) return { longitude: 0, latitude: 0 };
    const lngSum = coords.reduce((sum, c) => sum + c[0], 0);
    const latSum = coords.reduce((sum, c) => sum + c[1], 0);
    return {
      longitude: lngSum / coords.length,
      latitude: latSum / coords.length,
    };
  }, [coords]);

  const bounds = useMemo(() => {
    if (coords.length === 0) return null;
    const lons = coords.map(c => c[0]);
    const lats = coords.map(c => c[1]);
    return {
      minLon: Math.min(...lons),
      maxLon: Math.max(...lons),
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
    };
  }, [coords]);

  // 2. Measure viewport size on mount
  useEffect(() => {
    const handleResize = () => {
      if (mapContainerRef.current) {
        setViewport({
          width: mapContainerRef.current.offsetWidth,
          height: mapContainerRef.current.offsetHeight,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. Estimate zoom level
  const zoom = useMemo(() => {
    if (!bounds) return 2;

    const TILE_SIZE = 256;
    const WORLD_DIM = { width: viewport.width, height: viewport.height };
    const ZOOM_MAX = 20;

    const lngDelta = bounds.maxLon - bounds.minLon;
    const latDelta = bounds.maxLat - bounds.minLat;

    const latZoom = Math.log2(WORLD_DIM.height * 360 / (TILE_SIZE * latDelta));
    const lngZoom = Math.log2(WORLD_DIM.width * 360 / (TILE_SIZE * lngDelta));

    return Math.max(1, Math.min(Math.min(latZoom, lngZoom) - 2, ZOOM_MAX));
  }, [bounds, viewport]);
  
  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: 'calc(100% - 20px)' }}>
      <Map
        initialViewState={{
          latitude: center.latitude,
          longitude: center.longitude,
          zoom: zoom || 1
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="/map_style.json"
      >
        {
          servers.filter(s => s.coordinates).map((s, i) => (
            <Marker longitude={s.coordinates?.[0] || 0} latitude={s.coordinates?.[1] || 0} color="red" key={i}>
              <Popover>
                <PopoverTrigger>
                  <MapPin />
                </PopoverTrigger>
                <PopoverContent className='w-96'>
                  <ServerComponent server={s} index={i} session={null} />
                </PopoverContent>
              </Popover>
            </Marker>
          ))
        }
      </Map>
    </div>
  );
}