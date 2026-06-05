import { useEffect, useState } from "react";
import { analysisApi, type AnalysisRecord } from "../api/client";

const statusColor: Record<string, string> = {
  pending: "#f59e0b",
  approved: "#3b82f6",
  rejected: "#ef4444",
  applied: "#22c55e",
};

export default function AnalysisHistory() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    analysisApi.listRecords().then((res) => {
      setRecords(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p style={{ padding: 24 }}>로딩 중...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h2>분석 이력</h2>
      {records.length === 0 ? (
        <p style={{ color: "#888" }}>분석 이력이 없습니다.</p>
      ) : (
        records.map((r) => (
          <div
            key={r.id}
            style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 12, cursor: "pointer" }}
            onClick={() => setExpanded(expanded === r.id ? null : r.id)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{r.trigger_line.slice(0, 80)}...</span>
              <span
                style={{
                  background: statusColor[r.status] || "#888",
                  color: "white",
                  borderRadius: 12,
                  padding: "2px 10px",
                  fontSize: 12,
                }}
              >
                {r.status}
              </span>
            </div>
            <p style={{ margin: "4px 0", color: "#888", fontSize: 12 }}>
              서버 #{r.server_id} · {new Date(r.created_at).toLocaleString("ko-KR")}
            </p>

            {expanded === r.id && (
              <div style={{ marginTop: 12, background: "#f8f8f8", borderRadius: 4, padding: 12 }}>
                <h4 style={{ margin: "0 0 8px" }}>LLM 분석 결과</h4>
                <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, margin: 0 }}>
                  {r.llm_suggestion || "분석 결과 없음"}
                </pre>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
