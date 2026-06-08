import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serversApi } from "../api/client";

export default function ServerEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [hosts, setHosts] = useState<string[]>([""]);
  const [gitRepoUrl, setGitRepoUrl] = useState("");
  const [gitBranch, setGitBranch] = useState("main");
  const [githubToken, setGithubToken] = useState("");
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    serversApi.list().then((res) => {
      const server = res.data.find((s) => s.id === Number(id));
      if (!server) { navigate("/"); return; }
      setName(server.name);
      setHosts(server.hosts.length ? server.hosts : [""]);
      setGitRepoUrl(server.git_repo_url);
      setGitBranch(server.git_branch);
      setSlackWebhookUrl(server.slack_webhook_url || "");
    });
  }, [id]);

  const addHost = () => setHosts([...hosts, ""]);
  const removeHost = (i: number) => setHosts(hosts.filter((_, idx) => idx !== i));
  const updateHost = (i: number, val: string) =>
    setHosts(hosts.map((h, idx) => (idx === i ? val : h)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = hosts.map((h) => h.trim()).filter(Boolean);
    if (!filtered.length) { setError("IP를 하나 이상 입력해주세요."); return; }
    setLoading(true);
    setError("");
    try {
      await serversApi.update(Number(id), {
        name,
        hosts: filtered,
        git_repo_url: gitRepoUrl.trim(),
        git_branch: gitBranch.trim() || "main",
        github_token: githubToken.trim() || undefined,
        slack_webhook_url: slackWebhookUrl.trim() || undefined,
      });
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "수정 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
      <h2>서버 수정</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>서버 이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <button type="button" onClick={addHost} style={{ padding: "4px 12px", fontSize: 13, cursor: "pointer" }}>
            + IP 추가
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Git 저장소 URL</label>
          <input
            type="text"
            value={gitRepoUrl}
            onChange={(e) => setGitRepoUrl(e.target.value)}
            required
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>브랜치</label>
          <input
            type="text"
            value={gitBranch}
            onChange={(e) => setGitBranch(e.target.value)}
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
            GitHub Token <span style={{ color: "#94a3b8", fontWeight: 400 }}>(변경 시에만 입력)</span>
          </label>
          <input
            type="password"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxx"
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>

        <hr style={{ margin: "20px 0", borderColor: "#e2e8f0" }} />
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 12 }}>
          Slack 알림 설정 (둘 중 하나만 입력해도 됩니다)
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
            Slack Webhook URL <span style={{ color: "#94a3b8", fontWeight: 400 }}>(Incoming Webhook)</span>
          </label>
          <input
            type="text"
            value={slackWebhookUrl}
            onChange={(e) => setSlackWebhookUrl(e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button type="submit" disabled={loading} style={{ padding: "10px 24px" }}>
            {loading ? "저장 중..." : "저장"}
          </button>
          <button type="button" onClick={() => navigate("/")} style={{ padding: "10px 24px", background: "white", border: "1px solid #ddd", cursor: "pointer" }}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
