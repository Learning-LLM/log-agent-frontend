import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import AnalysisHistory from "./pages/AnalysisHistory";
import Dashboard from "./pages/Dashboard";
import ServerRegister from "./pages/ServerRegister";

function NavBar() {
  return (
    <nav
      style={{
        background: "#1e293b",
        color: "white",
        padding: "12px 24px",
        display: "flex",
        gap: 24,
        alignItems: "center",
      }}
    >
      <span style={{ fontWeight: 700, fontSize: 18 }}>AI Log Agent</span>
      <Link to="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Dashboard</Link>
      <Link to="/register" style={{ color: "#94a3b8", textDecoration: "none" }}>서버 등록</Link>
      <Link to="/history" style={{ color: "#94a3b8", textDecoration: "none" }}>분석 이력</Link>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<ServerRegister />} />
        <Route path="/history" element={<AnalysisHistory />} />
      </Routes>
    </BrowserRouter>
  );
}
