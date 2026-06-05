import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serversApi, type ServerCreate } from "../api/client";

const defaultForm: ServerCreate = {
  name: "",
  host: "",
  username: "ec2-user",
  pem_key: "",
  project_path: "/home/ec2-user/Project/puppynote-server",
  log_path: "/home/ec2-user/Project/puppynote-server/logs/app.log",
  git_branch: "main",
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

  const field = (
    label: string,
    key: keyof ServerCreate,
    placeholder?: string,
    textarea?: boolean
  ) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>{label}</label>
      {textarea ? (
        <textarea
          rows={8}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder}
          style={{ width: "100%", fontFamily: "monospace", fontSize: 12, padding: 8, boxSizing: "border-box" }}
        />
      ) : (
        <input
          type="text"
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder}
          style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
        />
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      <h2>서버 등록</h2>
      <form onSubmit={handleSubmit}>
        {field("서버 이름", "name", "예: puppynote-prod")}
        {field("호스트 IP", "host", "예: 13.124.xxx.xxx")}
        {field("SSH 사용자", "username", "ec2-user")}
        {field(".pem 키 내용", "pem_key", "-----BEGIN RSA PRIVATE KEY-----", true)}
        {field("프로젝트 경로", "project_path", "/home/ec2-user/Project/puppynote-server")}
        {field("로그 파일 경로", "log_path", "/home/ec2-user/Project/puppynote-server/logs/app.log")}
        {field("Git 브랜치", "git_branch", "main")}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: "10px 24px" }}>
          {loading ? "등록 중..." : "등록"}
        </button>
      </form>
    </div>
  );
}
