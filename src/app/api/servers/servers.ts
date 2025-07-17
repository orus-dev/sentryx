import Server, { ServerAPI } from "@/types/server";
import Data from "../data";

export const useServer = (server: ServerAPI, index: number) => {
  const ws = new WebSocket(`ws://${server.ip}:5273`);
  ws.onmessage = (msg) => {
    try {
      if (deletes.has(index) || !currentServers[index]) {
        ws.close();
        return;
      }
      if (msg.data === "Success") {return}
      const data = JSON.parse(msg.data);
      
      if (data.status) {
        currentServers[index].status = data.status;
      }
      if (data.cpu) {
        currentServers[index].cpu = data.cpu;
      }
      if (data.memory) {
        currentServers[index].memory = data.memory;
      }
      if (data.disk) {
        currentServers[index].storage = data.disk;
      }
      if (data.network) {
        currentServers[index].network = data.network;
      }
    } catch (e) {
      console.error("Error parsing WebSocket message:", e);
    }
  };
  ws.onopen = () => ws.send("my-key");
};

export const deletes = new Set<number>();
export const servers = new Data<ServerAPI[]>("sentryx/servers.json", []);
export var currentServers: Server[] = servers.data.map(
  (s) =>
    ({
      ...s,
      status: "offline",
      cpu: 0,
      memory: 0,
      storage: 0,
      network: 0,
    } as Server)
);

servers.data.map(useServer);
