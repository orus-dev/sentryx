import { AppService } from "./service";

export interface ServerAPI {
  name: string;
  ip: string;
  location?: string;
  coordinates?: [number, number];
  apps: AppService[];
}

export default interface Server extends ServerAPI {
  status: "online" | "offline" | "warning" | "maintenance";
  cpu: number;
  memory: number;
  storage: number;
  network: number;
}
