import Server, { ServerAPI } from "@/types/server";
import Data from "../data";
import axios from "axios";

export const useServer = (server: ServerAPI, index: number) => {
  const interval = setInterval(() => {
    if (deletes.has(index) || !currentServers[index]) {
      deletes.delete(index);
      interval.close();
      return;
    }
    axios.get(`http://${server.ip}:8080/`, {params: {auth: 'my-key'}}).then(({data}) => {
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
    }).catch((e) => {
      console.error(e.data);
    })
  }, 2000);
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
