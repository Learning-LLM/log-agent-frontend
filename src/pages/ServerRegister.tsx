import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serversApi, type ServerCreate } from "../api/client";

const defaultForm: ServerCreate = {
  name: "",
  host: "",
};

export default function ServerRegister() {
  const [form, setForm] = useState<ServerCreate>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await serversApi.create(form);
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
        등록된 서버 IP에서 에러가 전송될 때만 LLM 분석이 동작합니다.
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>서버 이름</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="예: puppynote-dev"
            required
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>서버 IP</label>
          <input
            type="text"
            value={form.host}
            onChange={(e) => setForm({ ...form, host: e.target.value })}
            placeholder="예: 13.124.xxx.xxx"
            required
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: "10px 24px" }}>
          {loading ? "등록 중..." : "등록"}
        </button>
      </form>
    </div>
  );
}
