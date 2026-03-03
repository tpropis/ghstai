import { useEffect, useState } from "react";

const NAV = ["Dashboard", "Services", "Logs", "Settings"];

export default function Home() {
  const [proxyStatus, setProxyStatus] = useState("checking");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const check = () => {
      fetch("/api/status")
        .then(r => r.json())
        .then(d => setProxyStatus(d.status === "healthy" ? "online" : "degraded"))
        .catch(() => setProxyStatus("offline"));
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setUptime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatUptime = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const statusColor = { online: "#00E5A0", degraded: "#F5A623", offline: "#FF4D4D", checking: "#888" };
  const dot = statusColor[proxyStatus] || "#888";

  const services = [
    { name: "Proxy API",    port: 5000, status: proxyStatus, type: "FastAPI"  },
    { name: "Dashboard",   port: 8080, status: "online",     type: "Next.js"  },
  ];

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-wrap">
          <img src="/logo.png" alt="GHST AI" className="logo-img" />
          <span className="logo-text">GHST <span className="logo-accent">AI</span></span>
        </div>

        <div className="nav-section-label">PLATFORM</div>
        <nav>
          {NAV.map(n => (
            <div
              key={n}
              className={`nav-item${activeNav === n ? " active" : ""}`}
              onClick={() => setActiveNav(n)}
            >
              <span className="nav-icon">{navIcon(n)}</span>
              {n}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="footer-dot" style={{ background: dot }} />
          <span>System {proxyStatus}</span>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <header className="topbar">
          <div>
            <h2 className="page-title">{activeNav}</h2>
            <p className="page-sub">GHST AI Platform &mdash; Control Center</p>
          </div>
          <div className="uptime-chip">
            <span className="uptime-icon">⏱</span>
            {formatUptime(uptime)}
          </div>
        </header>

        {activeNav === "Dashboard" && (
          <>
            {/* Status row */}
            <div className="stat-row">
              {[
                { label: "Proxy",     value: proxyStatus.toUpperCase(), color: dot },
                { label: "Services",  value: "2 / 2",   color: "#00E5A0" },
                { label: "Uptime",    value: formatUptime(uptime), color: "#7B8CFF" },
                { label: "Latency",   value: "~12 ms",  color: "#F5A623" },
              ].map(s => (
                <div className="stat-card" key={s.label}>
                  <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Services table */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Running Services</span>
                <span className="badge">LIVE</span>
              </div>
              <table className="service-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Type</th>
                    <th>Port</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(svc => (
                    <tr key={svc.name}>
                      <td className="svc-name">{svc.name}</td>
                      <td className="svc-type">{svc.type}</td>
                      <td className="svc-port">{svc.port}</td>
                      <td>
                        <span className="status-pill" style={{ background: (statusColor[svc.status] || "#888") + "22", color: statusColor[svc.status] || "#888" }}>
                          <span className="pill-dot" style={{ background: statusColor[svc.status] || "#888" }} />
                          {svc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Activity log */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Activity</span>
              </div>
              <div className="log-list">
                <LogLine time="now"   msg="Proxy health check passed" level="ok"   />
                <LogLine time="-5s"   msg="Dashboard connected to proxy via rewrite" level="ok" />
                <LogLine time="-10s"  msg="Services started via Docker Compose" level="info" />
                <LogLine time="-12s"  msg="GHST AI Platform booting…" level="info" />
              </div>
            </div>
          </>
        )}

        {activeNav !== "Dashboard" && (
          <div className="card empty-state">
            <div className="empty-icon">🚧</div>
            <div className="empty-label">{activeNav} coming soon</div>
          </div>
        )}
      </main>

      <style jsx>{`
        .logo-wrap   { display:flex; align-items:center; gap:10px; margin-bottom:36px; }
        .logo-img    { width:36px; height:36px; object-fit:contain; border-radius:8px; }
        .logo-text   { font-size:18px; font-weight:700; letter-spacing:.5px; }
        .logo-accent { color:#7B8CFF; }

        .nav-section-label { font-size:10px; letter-spacing:1.5px; opacity:.35; margin-bottom:10px; }
        .nav-item    { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:8px;
                       cursor:pointer; opacity:.55; font-size:14px; transition:all .15s; margin-bottom:4px; }
        .nav-item:hover  { opacity:.85; background:rgba(255,255,255,.04); }
        .nav-item.active { opacity:1; background:rgba(123,140,255,.12); color:#7B8CFF; }
        .nav-icon    { font-size:16px; width:20px; text-align:center; }

        .sidebar-footer { position:absolute; bottom:30px; display:flex; align-items:center; gap:8px;
                          font-size:12px; opacity:.5; }
        .footer-dot  { width:7px; height:7px; border-radius:50%; }

        .topbar      { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px; }
        .page-title  { margin:0; font-size:22px; font-weight:700; }
        .page-sub    { margin:4px 0 0; font-size:13px; opacity:.4; }
        .uptime-chip { background:#1C1F27; border:1px solid rgba(255,255,255,.07); border-radius:20px;
                       padding:8px 16px; font-size:13px; font-family:monospace; display:flex; align-items:center; gap:7px; }
        .uptime-icon { font-size:14px; }

        .stat-row    { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; }
        .stat-card   { background:#171A20; border:1px solid rgba(255,255,255,.05); border-radius:12px;
                       padding:22px 24px; }
        .stat-value  { font-size:22px; font-weight:700; margin-bottom:6px; font-family:monospace; }
        .stat-label  { font-size:12px; opacity:.45; letter-spacing:.5px; text-transform:uppercase; }

        .card        { background:#171A20; border:1px solid rgba(255,255,255,.05); border-radius:14px;
                       padding:24px; margin-bottom:20px; }
        .card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
        .card-title  { font-size:14px; font-weight:600; }
        .badge       { font-size:10px; letter-spacing:1px; background:rgba(0,229,160,.12);
                       color:#00E5A0; padding:3px 8px; border-radius:20px; }

        .service-table { width:100%; border-collapse:collapse; font-size:13px; }
        .service-table th { text-align:left; opacity:.35; font-size:11px; letter-spacing:.8px;
                            text-transform:uppercase; padding-bottom:12px; font-weight:500; }
        .service-table td { padding:12px 0; border-top:1px solid rgba(255,255,255,.04); }
        .svc-name    { font-weight:600; }
        .svc-type    { opacity:.5; font-family:monospace; font-size:12px; }
        .svc-port    { font-family:monospace; opacity:.6; }
        .status-pill { display:inline-flex; align-items:center; gap:5px; padding:4px 10px;
                       border-radius:20px; font-size:11px; font-weight:600; letter-spacing:.4px; }
        .pill-dot    { width:6px; height:6px; border-radius:50%; }

        .log-list    { display:flex; flex-direction:column; gap:10px; }

        .empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center;
                       min-height:200px; opacity:.4; }
        .empty-icon  { font-size:36px; margin-bottom:12px; }
        .empty-label { font-size:14px; }
      `}</style>
    </div>
  );
}

function LogLine({ time, msg, level }) {
  const col = level === "ok" ? "#00E5A0" : "#7B8CFF";
  return (
    <div style={{ display:"flex", gap:16, fontSize:13 }}>
      <span style={{ opacity:.35, fontFamily:"monospace", minWidth:36 }}>{time}</span>
      <span style={{ width:6, height:6, borderRadius:"50%", background:col, marginTop:5, flexShrink:0 }} />
      <span style={{ opacity:.75 }}>{msg}</span>
    </div>
  );
}

function navIcon(n) {
  return { Dashboard:"⬛", Services:"⚙️", Logs:"📋", Settings:"🔧" }[n] || "•";
}
