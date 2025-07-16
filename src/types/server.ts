export interface ServerAPI {
  name: string;
  ip: string;
}

export default interface Server extends ServerAPI {
  status: "online" | "offline" | "warning" | "maintenance";
}
