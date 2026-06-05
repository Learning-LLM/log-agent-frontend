import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://log-agent-api.sangkihan.co.kr",
  headers: { "Content-Type": "application/json" },
});

export interface ServerCreate {
  name: string;
  host: string;
}

export interface ServerResponse {
  id: number;
  name: string;
  host: string;
  is_active: boolean;
}

export interface AnalysisRecord {
  id: number;
  server_id: number;
  trigger_line: string;
  raw_log: string;
  llm_suggestion: string | null;
  status: "pending" | "approved" | "rejected" | "applied";
  slack_ts: string | null;
  created_at: string;
}

export const serversApi = {
  list: () => api.get<ServerResponse[]>("/api/v1/servers"),
  create: (data: ServerCreate) => api.post<ServerResponse>("/api/v1/servers", data),
  delete: (id: number) => api.delete(`/api/v1/servers/${id}`),
};

export const analysisApi = {
  listRecords: (serverId?: number) =>
    api.get<AnalysisRecord[]>("/api/v1/analysis/records", {
      params: serverId ? { server_id: serverId } : {},
    }),
};
