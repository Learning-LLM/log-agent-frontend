import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { serversApi, type ServerResponse } from "../api/client";
import ServerCard from "../components/ServerCard";

export default function Dashboard() {
  const [servers, setServers] = useState<ServerResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await serversApi.list();
      setServers(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    await serversApi.delete(id);
    load();
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>등록된 서버</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/register">
            <button style={{ padding: "8px 16px" }}>+ 서버 등록</button>
          </Link>
          <Link to="/history">
            <button style={{ padding: "8px 16px" }}>분석 이력</button>
          </Link>
        </div>
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : servers.length === 0 ? (
        <p style={{ color: "#888" }}>등록된 서버가 없습니다. 서버를 먼저 등록해주세요.</p>
      ) : (
        servers.map((s) => <ServerCard key={s.id} server={s} onDelete={handleDelete} />)
      )}
    </div>
  );
}
