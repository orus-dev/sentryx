import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import Server from '@/types/server';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin } from 'lucide-react';
import ServerComponent from '../dashboard/server';

export default function ServerMap({ servers }: { servers: Server[] }) {
  return (
    <Map
      style={{width: "100%", height: "100%"}}
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
  );
}