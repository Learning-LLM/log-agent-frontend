import type { ServerResponse } from "../api/client";

interface Props {
  server: ServerResponse;
  onDelete: (id: number) => void;
}

export default function ServerCard({ server, onDelete }: Props) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h3 style={{ margin: 0 }}>{server.name}</h3>
        <div style={{ marginTop: 4, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {server.hosts.map((ip) => (
            <span
              key={ip}
              style={{ background: "#f1f5f9", borderRadius: 4, padding: "2px 8px", fontSize: 12, color: "#475569" }}
            >
              {ip}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span
          style={{
            background: server.is_active ? "#22c55e" : "#ef4444",
            color: "white",
            borderRadius: 12,
            padding: "2px 10px",
            fontSize: 12,
          }}
        >
          {server.is_active ? "Active" : "Inactive"}
        </span>
        <button
          onClick={() => onDelete(server.id)}
          style={{ padding: "4px 12px", cursor: "pointer", color: "#ef4444", border: "1px solid #ef4444", background: "white", borderRadius: 4 }}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
