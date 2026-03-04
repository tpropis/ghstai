import { useEffect, useState } from "react";

// ── Provider config ────────────────────────────────────────────────────────────
const PROVIDERS = [
  {
    id: "chatgpt", name: "ChatGPT", sub: "OpenAI",
    color: "#10A37F", btnClass: "btn-openai",
    placeholder: "sk-...", hint: "should start with sk-",
    validate: k => k.startsWith("sk-") && !k.startsWith("sk-ant-"),
    link: "https://platform.openai.com/api-keys",
    iconClass: "openai-icon",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.28 9.28a5.76 5.76 0 0 0-.49-4.73 5.82 5.82 0 0 0-6.27-2.8A5.76 5.76 0 0 0 11.2 0a5.82 5.82 0 0 0-5.55 4.03 5.76 5.76 0 0 0-3.84 2.8 5.82 5.82 0 0 0 .72 6.82 5.76 5.76 0 0 0 .49 4.73 5.82 5.82 0 0 0 6.27 2.8A5.76 5.76 0 0 0 12.8 24a5.82 5.82 0 0 0 5.55-4.04 5.76 5.76 0 0 0 3.84-2.79 5.82 5.82 0 0 0-.71-6.89zM12.8 22.4a4.32 4.32 0 0 1-2.77-1c.03-.02.09-.05.13-.08l4.6-2.66a.76.76 0 0 0 .38-.66v-6.5l1.95 1.12a.07.07 0 0 1 .04.05v5.38A4.34 4.34 0 0 1 12.8 22.4zm-9.33-3.97a4.32 4.32 0 0 1-.52-2.91c.03.02.09.06.13.08l4.6 2.66c.23.14.52.14.76 0l5.62-3.24v2.24a.07.07 0 0 1-.03.06L9.4 20.04a4.34 4.34 0 0 1-5.93-1.6zm-1.21-9.52a4.32 4.32 0 0 1 2.25-1.9v5.48a.75.75 0 0 0 .38.65l5.62 3.24-1.95 1.12a.07.07 0 0 1-.07 0L4.07 14.9A4.34 4.34 0 0 1 2.26 8.9zm16.04 3.73-5.62-3.24 1.95-1.12a.07.07 0 0 1 .07 0l4.43 2.56a4.34 4.34 0 0 1-.67 7.83v-5.48a.75.75 0 0 0-.16-.55zm1.94-2.93c-.03-.02-.09-.06-.13-.08l-4.6-2.65a.76.76 0 0 0-.76 0L9.13 10.2V7.96a.07.07 0 0 1 .03-.06l4.43-2.56a4.34 4.34 0 0 1 6.45 4.49l-.8.81zm-12.18 4-1.95-1.13a.07.07 0 0 1-.04-.05V7.14a4.34 4.34 0 0 1 7.12-3.33c-.03.02-.09.05-.13.07l-4.6 2.66a.76.76 0 0 0-.38.66l-.02 6.5zm1.06-2.28 2.5-1.44 2.5 1.44v2.88l-2.5 1.44-2.5-1.44V12.4z"/>
      </svg>
    ),
  },
  {
    id: "claude", name: "Claude", sub: "Anthropic",
    color: "#D97559", btnClass: "btn-claude",
    placeholder: "sk-ant-...", hint: "should start with sk-ant-",
    validate: k => k.startsWith("sk-ant-"),
    link: "https://console.anthropic.com/settings/keys",
    iconClass: "claude-icon",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.3 2H6.7L2 12l4.7 10h10.6L24 12 17.3 2zM12 16.5c-2.5 0-4.5-2-4.5-4.5S9.5 7.5 12 7.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5z"/>
      </svg>
    ),
  },
  {
    id: "grok", name: "Grok", sub: "xAI",
    color: "#8A63FF", btnClass: "btn-grok",
    placeholder: "xai-...", hint: "should start with xai-",
    validate: k => k.startsWith("xai-"),
    link: "https://console.x.ai",
    iconClass: "grok-icon",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h7.5L21 21h-7.5L3 3zm0 18 6-9 3 4.5L9 21H3zm18-18-6 9-3-4.5L15 3h6z"/>
      </svg>
    ),
  },
  {
    id: "gemini", name: "Gemini", sub: "Google AI",
    color: "#4285F4", btnClass: "btn-gemini",
    placeholder: "AIza...", hint: "should start with AIza",
    validate: k => k.startsWith("AIza"),
    link: "https://aistudio.google.com/app/apikey",
    iconClass: "gemini-icon",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        <path d="M12 .5C5.65.5.5 5.65.5 12S5.65 23.5 12 23.5 23.5 18.35 23.5 12 18.35.5 12 .5zm0 4c.55 0 1 .45 1 1v5l4.33 2.5c.48.28.64.89.36 1.37-.28.48-.89.64-1.37.36L11 12.27V5.5c0-.55.45-1 1-1z"/>
      </svg>
    ),
  },
];

function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

// ── Icons ──────────────────────────────────────────────────────────────────────
const DashboardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const SettingsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const ActivityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

// ── Main component ─────────────────────────────────────────────────────────────
export default function Home() {
  const [tab, setTab] = useState("dashboard");
  const [proxyStatus, setProxyStatus] = useState("checking");
  const [metrics, setMetrics] = useState({ total_requests: 0, success_rate: 100, avg_latency_ms: 0, errors: 0 });
  const [reqLogs, setReqLogs] = useState([]);
  const [, setTick] = useState(0);

  // Provider state — keys, connected, error
  const [keys, setKeys] = useState({ chatgpt: "", claude: "", grok: "", gemini: "" });
  const [connected, setConnected] = useState({ chatgpt: false, claude: false, grok: false, gemini: false });
  const [errors, setErrors] = useState({ chatgpt: "", claude: "", grok: "", gemini: "" });

  // Poll proxy every 3 s
  useEffect(() => {
    const refresh = () => {
      fetch("/api/status")
        .then(r => r.json())
        .then(d => setProxyStatus(d.status === "healthy" ? "online" : "degraded"))
        .catch(() => setProxyStatus("offline"));

      fetch("/api/metrics")
        .then(r => r.json())
        .then(setMetrics)
        .catch(() => {});

      fetch("/api/logs?limit=50")
        .then(r => r.json())
        .then(d => setReqLogs(d.logs || []))
        .catch(() => {});
    };
    refresh();
    const iv = setInterval(refresh, 3000);
    return () => clearInterval(iv);
  }, []);

  // Update relative timestamps every 10 s
  useEffect(() => {
    const iv = setInterval(() => setTick(n => n + 1), 10000);
    return () => clearInterval(iv);
  }, []);

  const handleConnect = (id) => {
    const p = PROVIDERS.find(x => x.id === id);
    const key = keys[id].trim();
    if (!key) { setErrors(prev => ({ ...prev, [id]: "Please enter your API key" })); return; }
    if (!p.validate(key)) { setErrors(prev => ({ ...prev, [id]: `Invalid key — ${p.hint}` })); return; }
    setErrors(prev => ({ ...prev, [id]: "" }));
    setConnected(prev => ({ ...prev, [id]: true }));
    setTab("dashboard");
  };

  const handleDisconnect = (id) => {
    setConnected(prev => ({ ...prev, [id]: false }));
    setKeys(prev => ({ ...prev, [id]: "" }));
  };

  const connectedCount = Object.values(connected).filter(Boolean).length;
  const statusColor = { online: "#00E5A0", degraded: "#F5A623", offline: "#FF4D4D", checking: "#888" }[proxyStatus];
  const srColor = metrics.success_rate >= 99 ? "#00E5A0" : metrics.success_rate >= 95 ? "#F5A623" : "#FF4D4D";

  return (
    <div className="page">

      {/* ── Header ── */}
      <header className="header">
        <img src="/logo.png" alt="GHST AI" className="nav-logo" />

        <nav className="nav-tabs">
          <button className={`nav-tab ${tab === "dashboard" ? "active" : ""}`} onClick={() => setTab("dashboard")}>
            <DashboardIcon /> Dashboard
          </button>
          <button className={`nav-tab ${tab === "settings" ? "active" : ""}`} onClick={() => setTab("settings")}>
            <SettingsIcon /> Settings
          </button>
        </nav>

        <div className="status-chip">
          <span className="status-dot" style={{ background: statusColor }} />
          System {proxyStatus}
        </div>
      </header>

      <div className="content">

        {/* ── DASHBOARD TAB ── */}
        {tab === "dashboard" && (
          <div className="dashboard">

            {connectedCount === 0 ? (

              /* ── Empty / not connected ── */
              <div className="empty-dashboard">
                <div className="empty-ghost">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 10h.01M15 10h.01M12 2C6.48 2 2 6.48 2 12v9l3-3 2 2 2-2 2 2 2-2 2 2 3 3v-9c0-5.52-4.48-10-10-10z"/>
                  </svg>
                </div>
                <h2 className="empty-heading">No services connected</h2>
                <p className="empty-desc">Connect at least one AI provider to start routing requests and see live metrics here.</p>
                <button className="btn-cta" onClick={() => setTab("settings")}>Connect a provider →</button>
              </div>

            ) : (

              /* ── Internal dashboard (connected) ── */
              <>
                {/* Connected services */}
                <div className="section-row">
                  <span className="section-label">Connected services</span>
                  <button className="link-btn" onClick={() => setTab("settings")}>+ Manage</button>
                </div>
                <div className="service-cards">
                  {PROVIDERS.filter(p => connected[p.id]).map(p => (
                    <div key={p.id} className="service-card" style={{ "--accent": p.color }}>
                      <div className="sc-header">
                        <div className={`sc-icon ${p.iconClass}`}>{p.icon}</div>
                        <div>
                          <div className="sc-name">{p.name}</div>
                          <div className="sc-sub">{p.sub}</div>
                        </div>
                        <span className="sc-badge">
                          <span className="sc-dot" style={{ background: p.color }} />
                          routing
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats row */}
                <div className="stats-row">
                  <div className="stat-card">
                    <div className="stat-label">Total Requests</div>
                    <div className="stat-value">{metrics.total_requests.toLocaleString()}</div>
                    <div className="stat-sub">all time</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Success Rate</div>
                    <div className="stat-value" style={{ color: srColor }}>{metrics.success_rate}<span className="stat-unit">%</span></div>
                    <div className="stat-sub">{metrics.errors} error{metrics.errors !== 1 ? "s" : ""}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Avg Latency</div>
                    <div className="stat-value">{metrics.avg_latency_ms}<span className="stat-unit"> ms</span></div>
                    <div className="stat-sub">proxy overhead</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Proxy</div>
                    <div className="stat-value" style={{ fontSize: 16, paddingTop: 4, color: statusColor, textTransform: "capitalize" }}>{proxyStatus}</div>
                    <div className="stat-sub">{connectedCount} provider{connectedCount !== 1 ? "s" : ""} active</div>
                  </div>
                </div>

                {/* Request log */}
                <div className="log-panel">
                  <div className="panel-header">
                    <span className="panel-title">Request Log</span>
                    <span className="panel-count">{reqLogs.length} entries</span>
                    <span className="live-badge">
                      <span className="live-dot" />
                      LIVE
                    </span>
                  </div>

                  {reqLogs.length === 0 ? (
                    <div className="log-empty">
                      <div className="empty-icon"><ActivityIcon /></div>
                      <p className="empty-title">No requests yet</p>
                      <p className="empty-sub">Traffic routed through this proxy will appear here in real time.</p>
                    </div>
                  ) : (
                    <div className="table-wrap">
                      <table className="log-table">
                        <thead>
                          <tr>
                            <th>Time</th>
                            <th>Method</th>
                            <th>Path</th>
                            <th>Status</th>
                            <th>Latency</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reqLogs.map((log, i) => (
                            <tr key={i}>
                              <td className="col-time">{timeAgo(log.time)}</td>
                              <td><span className={`method-badge method-${log.method.toLowerCase()}`}>{log.method}</span></td>
                              <td className="col-path">{log.path}</td>
                              <td>
                                <span className={`status-badge ${log.status < 300 ? "s-ok" : log.status < 500 ? "s-warn" : "s-err"}`}>
                                  {log.status}
                                </span>
                              </td>
                              <td className="col-latency">{log.latency_ms} ms</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === "settings" && (
          <div className="settings">

            <div className="settings-section">
              <h2 className="section-title">API Providers</h2>
              <p className="section-desc">Connect your AI provider keys to route requests through GHST AI.</p>
              <div className="cards">
                {PROVIDERS.map(p => (
                  <div key={p.id} className={`card ${connected[p.id] ? "card-connected" : ""}`}>
                    <div className="card-brand">
                      <div className={`brand-icon ${p.iconClass}`}>{p.icon}</div>
                      <div>
                        <div className="brand-name">{p.name}</div>
                        <div className="brand-sub">{p.sub}</div>
                      </div>
                      {connected[p.id] && <span className="connected-badge">Connected</span>}
                    </div>

                    {!connected[p.id] ? (
                      <>
                        <input
                          className="key-input"
                          type="password"
                          placeholder={p.placeholder}
                          value={keys[p.id]}
                          onChange={e => { setKeys(prev => ({ ...prev, [p.id]: e.target.value })); setErrors(prev => ({ ...prev, [p.id]: "" })); }}
                          onKeyDown={e => e.key === "Enter" && handleConnect(p.id)}
                        />
                        {errors[p.id] && <p className="error-msg">{errors[p.id]}</p>}
                        <button className={`btn ${p.btnClass}`} onClick={() => handleConnect(p.id)}>
                          Connect {p.name}
                        </button>
                        <a className="help-link" href={p.link} target="_blank" rel="noreferrer">
                          Get your API key →
                        </a>
                      </>
                    ) : (
                      <div className="connected-state">
                        <div className="connected-icon">✓</div>
                        <p>{p.name} is connected and routing through GHST AI.</p>
                        <button className="btn-ghost" onClick={() => handleDisconnect(p.id)}>Disconnect</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h2 className="section-title">Proxy</h2>
              <p className="section-desc">Internal proxy configuration and available endpoints.</p>
              <div className="info-table">
                <div className="info-row">
                  <span className="info-label">Status</span>
                  <span className="info-val" style={{ color: statusColor }}>{proxyStatus}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Endpoint</span>
                  <code className="info-code">http://proxy:5000</code>
                </div>
                <div className="info-row">
                  <span className="info-label">Health</span>
                  <code className="info-code">GET /api/status</code>
                </div>
                <div className="info-row">
                  <span className="info-label">Metrics</span>
                  <code className="info-code">GET /api/metrics</code>
                </div>
                <div className="info-row">
                  <span className="info-label">Logs</span>
                  <code className="info-code">GET /api/logs?limit=50</code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* ── Base ── */
        .page {
          min-height: 100vh;
          background: #0A0C10;
          color: #E6E6E6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* ── Header ── */
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 0 28px;
          height: 56px;
          background: rgba(10,12,16,.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .nav-logo {
          height: 28px;
          width: auto;
          object-fit: contain;
          filter: invert(1);
          flex-shrink: 0;
        }
        .nav-tabs {
          display: flex;
          gap: 4px;
          flex: 1;
        }
        .nav-tab {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px;
          border-radius: 8px;
          border: none;
          background: none;
          color: #E6E6E6;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          opacity: 0.38;
          transition: opacity .15s, background .15s;
        }
        .nav-tab:hover { opacity: 0.65; background: rgba(255,255,255,.05); }
        .nav-tab.active { opacity: 1; background: rgba(255,255,255,.08); }

        .status-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          opacity: 0.5;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 20px;
          padding: 5px 12px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }

        /* ── Content ── */
        .content {
          flex: 1;
          padding: 32px 28px 60px;
          max-width: 1100px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }

        /* ── Dashboard ── */
        .dashboard {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Empty dashboard */
        .empty-dashboard {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 14px;
          text-align: center;
        }
        .empty-ghost {
          opacity: 0.15;
          margin-bottom: 8px;
        }
        .empty-heading {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          opacity: 0.7;
        }
        .empty-desc {
          margin: 0;
          font-size: 13px;
          opacity: 0.35;
          max-width: 320px;
          line-height: 1.6;
        }
        .btn-cta {
          margin-top: 8px;
          padding: 10px 22px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 10px;
          color: #E6E6E6;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background .15s, border-color .15s;
        }
        .btn-cta:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.2); }

        /* Section row */
        .section-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .section-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .7px;
          opacity: 0.35;
        }
        .link-btn {
          background: none;
          border: none;
          color: #E6E6E6;
          font-size: 12px;
          opacity: 0.35;
          cursor: pointer;
          padding: 0;
          transition: opacity .15s;
        }
        .link-btn:hover { opacity: 0.7; }

        /* Connected service cards */
        .service-cards {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .service-card {
          background: #13161C;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 14px;
          padding: 16px 20px;
          min-width: 200px;
          flex: 1;
          border-top: 2px solid var(--accent);
        }
        .sc-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sc-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .sc-name { font-size: 14px; font-weight: 700; }
        .sc-sub  { font-size: 10px; opacity: 0.35; text-transform: uppercase; letter-spacing: .5px; margin-top: 2px; }
        .sc-badge {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 600;
          opacity: 0.7;
        }
        .sc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        /* Stats row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .stat-card {
          background: #13161C;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 14px;
          padding: 20px 22px;
        }
        .stat-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .6px;
          opacity: 0.4;
          margin-bottom: 8px;
        }
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -.5px;
        }
        .stat-unit {
          font-size: 14px;
          font-weight: 500;
          opacity: 0.5;
        }
        .stat-sub {
          font-size: 11px;
          opacity: 0.3;
          margin-top: 6px;
        }

        /* Provider strip */
        .provider-strip {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .provider-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,.07);
          font-size: 13px;
          font-weight: 500;
          transition: border-color .2s;
        }
        .pill-on {
          background: rgba(255,255,255,.04);
          border-color: rgba(255,255,255,.12);
        }
        .pill-off {
          opacity: 0.35;
        }
        .pill-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .pill-icon {
          display: flex;
          align-items: center;
          opacity: 0.7;
        }
        .pill-status {
          font-size: 10px;
          font-weight: 600;
          color: #00E5A0;
          background: rgba(0,229,160,.1);
          padding: 2px 7px;
          border-radius: 20px;
          letter-spacing: .4px;
        }

        /* Log panel */
        .log-panel {
          background: #13161C;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 14px;
          overflow: hidden;
        }
        .panel-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .panel-title {
          font-size: 13px;
          font-weight: 600;
        }
        .panel-count {
          font-size: 11px;
          opacity: 0.35;
        }
        .live-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .8px;
          color: #00E5A0;
          margin-left: auto;
        }
        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00E5A0;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(.8); }
        }

        /* Empty state */
        .log-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 52px 20px;
          text-align: center;
        }
        .empty-icon {
          opacity: 0.18;
          margin-bottom: 4px;
        }
        .empty-title {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          opacity: 0.5;
        }
        .empty-sub {
          margin: 0;
          font-size: 12px;
          opacity: 0.28;
          max-width: 280px;
          line-height: 1.6;
        }

        /* Log table */
        .table-wrap {
          overflow-x: auto;
        }
        .log-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12.5px;
        }
        .log-table th {
          text-align: left;
          padding: 10px 16px;
          font-size: 10.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .5px;
          opacity: 0.3;
          border-bottom: 1px solid rgba(255,255,255,.05);
        }
        .log-table td {
          padding: 10px 16px;
          border-bottom: 1px solid rgba(255,255,255,.03);
        }
        .log-table tr:last-child td { border-bottom: none; }
        .log-table tr:hover td { background: rgba(255,255,255,.02); }

        .col-time { opacity: 0.4; font-variant-numeric: tabular-nums; white-space: nowrap; }
        .col-path { font-family: monospace; font-size: 12px; opacity: 0.7; }
        .col-latency { font-variant-numeric: tabular-nums; opacity: 0.55; white-space: nowrap; }

        .method-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
          letter-spacing: .3px;
        }
        .method-get  { background: rgba(66,133,244,.15); color: #4285F4; }
        .method-post { background: rgba(0,229,160,.12);  color: #00E5A0; }
        .method-put  { background: rgba(245,166,35,.12); color: #F5A623; }
        .method-delete { background: rgba(255,77,77,.12); color: #FF4D4D; }
        .method-patch { background: rgba(138,99,255,.12); color: #8A63FF; }

        .status-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 5px;
        }
        .s-ok   { background: rgba(0,229,160,.12);  color: #00E5A0; }
        .s-warn { background: rgba(245,166,35,.12); color: #F5A623; }
        .s-err  { background: rgba(255,77,77,.12);  color: #FF4D4D; }

        /* ── Settings ── */
        .settings {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        .settings-section {}
        .section-title {
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 4px;
        }
        .section-desc {
          font-size: 13px;
          opacity: 0.4;
          margin: 0 0 20px;
          line-height: 1.5;
        }

        /* Provider cards (2x2) */
        .cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .card {
          background: #13161C;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: border-color .2s, box-shadow .2s;
        }
        .card:hover { border-color: rgba(255,255,255,.12); }
        .card-connected {
          border-color: rgba(0,229,160,.22) !important;
          box-shadow: 0 0 0 1px rgba(0,229,160,.06) inset;
        }
        .card-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .openai-icon  { background: rgba(16,163,127,.15);  color: #10A37F; }
        .claude-icon  { background: rgba(217,117,89,.15);  color: #D97559; }
        .grok-icon    { background: rgba(138,99,255,.15);  color: #8A63FF; }
        .gemini-icon  { background: rgba(66,133,244,.15);  color: #4285F4; }
        .brand-name { font-size: 15px; font-weight: 700; }
        .brand-sub  { font-size: 11px; opacity: 0.35; margin-top: 2px; text-transform: uppercase; letter-spacing: .5px; }
        .connected-badge {
          margin-left: auto;
          font-size: 10px;
          font-weight: 600;
          background: rgba(0,229,160,.12);
          color: #00E5A0;
          padding: 3px 9px;
          border-radius: 20px;
          letter-spacing: .3px;
        }
        .key-input {
          width: 100%;
          background: #0A0C10;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 9px;
          padding: 10px 12px;
          font-size: 13px;
          color: #E6E6E6;
          font-family: monospace;
          outline: none;
          box-sizing: border-box;
          transition: border-color .15s;
        }
        .key-input:focus { border-color: rgba(255,255,255,.22); }
        .key-input::placeholder { opacity: 0.28; }
        .error-msg { margin: -4px 0 0; font-size: 12px; color: #FF4D4D; }
        .btn {
          width: 100%;
          padding: 11px;
          border: none;
          border-radius: 9px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity .15s, transform .1s;
        }
        .btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn:active { transform: translateY(0); }
        .btn-openai { background: #10A37F; color: #fff; }
        .btn-claude { background: #D97559; color: #fff; }
        .btn-grok   { background: #8A63FF; color: #fff; }
        .btn-gemini { background: #4285F4; color: #fff; }
        .help-link {
          font-size: 12px;
          color: inherit;
          opacity: 0.28;
          text-decoration: none;
          text-align: center;
        }
        .help-link:hover { opacity: 0.55; }
        .connected-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          text-align: center;
        }
        .connected-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(0,229,160,.1);
          color: #00E5A0;
          font-size: 19px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .connected-state p { margin: 0; font-size: 13px; opacity: 0.45; }
        .btn-ghost {
          background: none;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 8px;
          padding: 7px 18px;
          color: #E6E6E6;
          font-size: 12px;
          cursor: pointer;
          opacity: 0.42;
          transition: opacity .15s;
        }
        .btn-ghost:hover { opacity: 0.72; }

        /* Proxy info table */
        .info-table {
          background: #13161C;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 12px;
          overflow: hidden;
        }
        .info-row {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 12px 20px;
          border-bottom: 1px solid rgba(255,255,255,.04);
        }
        .info-row:last-child { border-bottom: none; }
        .info-label {
          font-size: 12px;
          opacity: 0.38;
          width: 100px;
          flex-shrink: 0;
        }
        .info-val {
          font-size: 13px;
          font-weight: 500;
        }
        .info-code {
          font-family: monospace;
          font-size: 12.5px;
          color: #8A63FF;
          background: rgba(138,99,255,.08);
          padding: 3px 8px;
          border-radius: 5px;
        }

        /* ── Responsive ── */
        @media (max-width: 720px) {
          .content { padding: 20px 16px 48px; }
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .cards { grid-template-columns: 1fr; }
          .header { padding: 0 16px; gap: 12px; }
        }
        @media (max-width: 480px) {
          .stats-row { grid-template-columns: 1fr 1fr; }
          .nav-tab span { display: none; }
        }
      `}</style>
    </div>
  );
}
