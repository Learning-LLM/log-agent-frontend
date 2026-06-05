import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serversApi } from "../api/client";

export default function ServerRegister() {
  const [name, setName] = useState("");
  const [hosts, setHosts] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const addHost = () => setHosts([...hosts, ""]);
  const removeHost = (i: number) => setHosts(hosts.filter((_, idx) => idx !== i));
  const updateHost = (i: number, val: string) =>
    setHosts(hosts.map((h, idx) => (idx === i ? val : h)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = hosts.map((h) => h.trim()).filter(Boolean);
    if (!filtered.length) {
      setError("IP를 하나 이상 입력해주세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await serversApi.create({ name, hosts: filtered });
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "서버 등록 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
      <h2>서버 등록</h2>
      <p style={{ color: "#64748b", fontSize: 14 }}>
        등록된 IP에서 에러가 전송될 때만 LLM 분석이 동작합니다.
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>서버 이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: puppynote-dev"
            required
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>서버 IP 목록</label>
          {hosts.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                type="text"
                value={h}
                onChange={(e) => updateHost(i, e.target.value)}
                placeholder="예: 13.124.xxx.xxx"
                style={{ flex: 1, padding: 8 }}
              />
              {hosts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeHost(i)}
                  style={{ padding: "4px 10px", color: "#ef4444", border: "1px solid #ef4444", background: "white", borderRadius: 4, cursor: "pointer" }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addHost}
            style={{ padding: "4px 12px", fontSize: 13, cursor: "pointer" }}
          >
            + IP 추가
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: "10px 24px", marginTop: 8 }}>
          {loading ? "등록 중..." : "등록"}
        </button>
      </form>
    </div>
  );
}
