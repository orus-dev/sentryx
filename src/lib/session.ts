import Server, { ServerAPI } from "@/types/server";
import axios from "axios";

export default class Session {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  public async getServers(query?: string): Promise<Server[]> {
    try {
      return (
        ((
          await axios.get(`/api/servers?s=${query || ""}`, {
            params: { id: this.id },
          })
        ).data.servers as Server[]) || []
      );
    } catch {
      return [];
    }
  }

  public async addServer(s: ServerAPI) {
    try {
      return (
        ((await axios.post("/api/servers", s)).data.servers as Server[]) || []
      );
    } catch {
      return [];
    }
  }
}
