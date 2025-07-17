export interface ServerAPI {
  name: string;
  ip: string;
  coordinates?: [number, number];
}

export default interface Server extends ServerAPI {
  status: "online" | "offline" | "warning" | "maintenance";
  cpu: number;
  memory: number;
  storage: number;
  network: number;
}
