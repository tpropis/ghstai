import { useEffect, useState } from "react";

// ── Provider config ─────────────────────────────────────────────────────────
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

// ── Main component ───────────────────────────────────────────────────────────
export default function Home() {
  // "connect" = onboarding screen | "dashboard" = internal app
  const [screen, setScreen] = useState("connect");
  const [tab, setTab]       = useState("overview");

  const [proxyStatus, setProxyStatus] = useState("checking");
  const [metrics, setMetrics]         = useState({ total_requests: 0, success_rate: 100, avg_latency_ms: 0, errors: 0 });
  const [reqLogs, setReqLogs]         = useState([]);
  const [, setTick]                   = useState(0);

  const [keys,      setKeys]      = useState({ chatgpt: "", claude: "", grok: "", gemini: "" });
  const [connected, setConnected] = useState({ chatgpt: false, claude: false, grok: false, gemini: false });
  const [errors,    setErrors]    = useState({ chatgpt: "", claude: "", grok: "", gemini: "" });

  // Poll proxy
  useEffect(() => {
    const refresh = () => {
      fetch("/api/status").then(r => r.json())
        .then(d => setProxyStatus(d.status === "healthy" ? "online" : "degraded"))
        .catch(() => setProxyStatus("offline"));
      fetch("/api/metrics").then(r => r.json()).then(setMetrics).catch(() => {});
      fetch("/api/logs?limit=50").then(r => r.json())
        .then(d => setReqLogs(d.logs || [])).catch(() => {});
    };
    refresh();
    const iv = setInterval(refresh, 3000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setTick(n => n + 1), 10000);
    return () => clearInterval(iv);
  }, []);

  const handleConnect = (id) => {
    const p   = PROVIDERS.find(x => x.id === id);
    const key = keys[id].trim();
    if (!key) { setErrors(e => ({ ...e, [id]: "Please enter your API key" })); return; }
    if (!p.validate(key)) { setErrors(e => ({ ...e, [id]: `Invalid — ${p.hint}` })); return; }
    setErrors(e => ({ ...e, [id]: "" }));
    setConnected(c => ({ ...c, [id]: true }));
    setScreen("dashboard");
    setTab("overview");
  };

  const handleDisconnect = (id) => {
    const next = { ...connected, [id]: false };
    setConnected(next);
    setKeys(k => ({ ...k, [id]: "" }));
    if (!Object.values(next).some(Boolean)) setScreen("connect");
  };

  const connectedProviders = PROVIDERS.filter(p => connected[p.id]);
  const connectedCount     = connectedProviders.length;
  const statusColor        = { online: "#00E5A0", degraded: "#F5A623", offline: "#FF4D4D", checking: "#888" }[proxyStatus];
  const srColor            = metrics.success_rate >= 99 ? "#00E5A0" : metrics.success_rate >= 95 ? "#F5A623" : "#FF4D4D";

  // ── CONNECT SCREEN ──────────────────────────────────────────────────────────
  if (screen === "connect") {
    return (
      <div className="connect-page">
        <div className="connect-inner">
          <div className="connect-logo">
            <img src="/logo.png" alt="GHST AI" />
          </div>
          <h1 className="connect-title">Connect a provider</h1>
          <p className="connect-sub">Enter your API key to start routing requests through GHST AI.</p>

          <div className="connect-grid">
            {PROVIDERS.map(p => (
              <div key={p.id} className="connect-card">
                <div className="cc-brand">
                  <div className={`cc-icon ${p.iconClass}`}>{p.icon}</div>
                  <div>
                    <div className="cc-name">{p.name}</div>
                    <div className="cc-sub">{p.sub}</div>
                  </div>
                </div>
                <input
                  className="cc-input"
                  type="password"
                  placeholder={p.placeholder}
                  value={keys[p.id]}
                  onChange={e => { setKeys(k => ({ ...k, [p.id]: e.target.value })); setErrors(err => ({ ...err, [p.id]: "" })); }}
                  onKeyDown={e => e.key === "Enter" && handleConnect(p.id)}
                />
                {errors[p.id] && <p className="cc-error">{errors[p.id]}</p>}
                <button className={`cc-btn ${p.btnClass}`} onClick={() => handleConnect(p.id)}>
                  Connect {p.name}
                </button>
                <a className="cc-link" href={p.link} target="_blank" rel="noreferrer">Get your API key →</a>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .connect-page {
            min-height: 100vh;
            background: #0A0C10;
            color: #E6E6E6;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            box-sizing: border-box;
          }
          .connect-inner {
            width: 100%;
            max-width: 760px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0;
          }
          .connect-logo img {
            height: 36px;
            width: auto;
            filter: invert(1);
            opacity: 0.9;
          }
          .connect-title {
            margin: 28px 0 8px;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -.5px;
          }
          .connect-sub {
            margin: 0 0 36px;
            font-size: 14px;
            opacity: 0.4;
            text-align: center;
            line-height: 1.5;
          }
          .connect-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            width: 100%;
          }
          .connect-card {
            background: #13161C;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 16px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }
          .cc-brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .cc-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .openai-icon  { background: rgba(16,163,127,.15); color: #10A37F; }
          .claude-icon  { background: rgba(217,117,89,.15);  color: #D97559; }
          .grok-icon    { background: rgba(138,99,255,.15);  color: #8A63FF; }
          .gemini-icon  { background: rgba(66,133,244,.15);  color: #4285F4; }
          .cc-name { font-size: 15px; font-weight: 700; }
          .cc-sub  { font-size: 11px; opacity: 0.35; text-transform: uppercase; letter-spacing: .5px; margin-top: 2px; }
          .cc-input {
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
          .cc-input:focus { border-color: rgba(255,255,255,.22); }
          .cc-input::placeholder { opacity: 0.28; }
          .cc-error { margin: -4px 0 0; font-size: 12px; color: #FF4D4D; }
          .cc-btn {
            width: 100%;
            padding: 11px;
            border: none;
            border-radius: 9px;
            font-size: 13.5px;
            font-weight: 600;
            cursor: pointer;
            transition: opacity .15s, transform .1s;
          }
          .cc-btn:hover { opacity: 0.88; transform: translateY(-1px); }
          .cc-btn:active { transform: translateY(0); }
          .btn-openai { background: #10A37F; color: #fff; }
          .btn-claude { background: #D97559; color: #fff; }
          .btn-grok   { background: #8A63FF; color: #fff; }
          .btn-gemini { background: #4285F4; color: #fff; }
          .cc-link {
            font-size: 12px;
            color: inherit;
            opacity: 0.25;
            text-decoration: none;
            text-align: center;
            transition: opacity .15s;
          }
          .cc-link:hover { opacity: 0.55; }
          @media (max-width: 560px) {
            .connect-grid { grid-template-columns: 1fr; }
            .connect-title { font-size: 22px; }
          }
        `}</style>
      </div>
    );
  }

  // ── INTERNAL DASHBOARD ──────────────────────────────────────────────────────
  return (
    <div className="app">

      <header className="header">
        <img src="/logo.png" alt="GHST AI" className="logo" />
        <nav className="nav">
          <button className={`nav-btn ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")}>
            Overview
          </button>
          <button className={`nav-btn ${tab === "connections" ? "active" : ""}`} onClick={() => setTab("connections")}>
            Connections
            <span className="nav-count">{connectedCount}</span>
          </button>
        </nav>
        <div className="status-pill">
          <span className="status-dot" style={{ background: statusColor }} />
          {proxyStatus}
        </div>
      </header>

      <main className="main">

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div className="overview">

            {/* Connected service cards */}
            <div className="row-header">
              <span className="row-label">Active services</span>
              <button className="text-btn" onClick={() => setTab("connections")}>+ Add</button>
            </div>
            <div className="service-row">
              {connectedProviders.map(p => (
                <div key={p.id} className="service-card" style={{ "--c": p.color }}>
                  <div className={`svc-icon ${p.iconClass}`}>{p.icon}</div>
                  <div>
                    <div className="svc-name">{p.name}</div>
                    <div className="svc-sub">{p.sub}</div>
                  </div>
                  <div className="svc-status">
                    <span className="svc-dot" style={{ background: p.color }} />
                    routing
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="stats">
              <div className="stat">
                <div className="stat-n">{metrics.total_requests.toLocaleString()}</div>
                <div className="stat-l">Requests</div>
              </div>
              <div className="stat">
                <div className="stat-n" style={{ color: srColor }}>{metrics.success_rate}%</div>
                <div className="stat-l">Success rate</div>
              </div>
              <div className="stat">
                <div className="stat-n">{metrics.avg_latency_ms} <span className="stat-u">ms</span></div>
                <div className="stat-l">Avg latency</div>
              </div>
              <div className="stat">
                <div className="stat-n" style={{ color: statusColor, fontSize: 18, textTransform: "capitalize" }}>{proxyStatus}</div>
                <div className="stat-l">Proxy</div>
              </div>
            </div>

            {/* Request log */}
            <div className="log-card">
              <div className="log-head">
                <span className="log-title">Request log</span>
                <span className="log-ct">{reqLogs.length} entries</span>
                <span className="live"><span className="live-dot" />LIVE</span>
              </div>
              {reqLogs.length === 0 ? (
                <div className="log-empty">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .2 }}>
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                  <p>No requests yet — traffic will appear here in real time.</p>
                </div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Time</th><th>Method</th><th>Path</th><th>Status</th><th>Latency</th></tr></thead>
                    <tbody>
                      {reqLogs.map((l, i) => (
                        <tr key={i}>
                          <td className="td-dim">{timeAgo(l.time)}</td>
                          <td><span className={`badge m-${l.method.toLowerCase()}`}>{l.method}</span></td>
                          <td className="td-path">{l.path}</td>
                          <td><span className={`badge ${l.status < 300 ? "s-ok" : l.status < 500 ? "s-warn" : "s-err"}`}>{l.status}</span></td>
                          <td className="td-dim">{l.latency_ms} ms</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CONNECTIONS TAB ── */}
        {tab === "connections" && (
          <div className="connections">
            <div className="conn-grid">
              {PROVIDERS.map(p => (
                <div key={p.id} className={`conn-card ${connected[p.id] ? "conn-on" : ""}`}>
                  <div className="cc-brand">
                    <div className={`cc-icon ${p.iconClass}`}>{p.icon}</div>
                    <div>
                      <div className="cc-name">{p.name}</div>
                      <div className="cc-sub">{p.sub}</div>
                    </div>
                    {connected[p.id] && <span className="conn-badge">Connected</span>}
                  </div>
                  {!connected[p.id] ? (
                    <>
                      <input
                        className="cc-input"
                        type="password"
                        placeholder={p.placeholder}
                        value={keys[p.id]}
                        onChange={e => { setKeys(k => ({ ...k, [p.id]: e.target.value })); setErrors(err => ({ ...err, [p.id]: "" })); }}
                        onKeyDown={e => e.key === "Enter" && handleConnect(p.id)}
                      />
                      {errors[p.id] && <p className="cc-error">{errors[p.id]}</p>}
                      <button className={`cc-btn ${p.btnClass}`} onClick={() => handleConnect(p.id)}>Connect {p.name}</button>
                      <a className="cc-link" href={p.link} target="_blank" rel="noreferrer">Get your API key →</a>
                    </>
                  ) : (
                    <div className="conn-active">
                      <div className="conn-check">✓</div>
                      <p>{p.name} is connected and routing through GHST AI.</p>
                      <button className="ghost-btn" onClick={() => handleDisconnect(p.id)}>Disconnect</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        /* ── App shell ── */
        .app {
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
          height: 56px;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 0 28px;
          background: rgba(10,12,16,.93);
          border-bottom: 1px solid rgba(255,255,255,.06);
          backdrop-filter: blur(12px);
        }
        .logo {
          height: 26px;
          width: auto;
          filter: invert(1);
          opacity: .9;
          flex-shrink: 0;
        }
        .nav {
          display: flex;
          gap: 4px;
          flex: 1;
        }
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px;
          border: none;
          border-radius: 8px;
          background: none;
          color: #E6E6E6;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          opacity: .38;
          transition: opacity .15s, background .15s;
        }
        .nav-btn:hover  { opacity: .65; background: rgba(255,255,255,.05); }
        .nav-btn.active { opacity: 1;   background: rgba(255,255,255,.08); }
        .nav-count {
          font-size: 10px;
          font-weight: 700;
          background: rgba(0,229,160,.15);
          color: #00E5A0;
          padding: 1px 6px;
          border-radius: 20px;
        }
        .status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          opacity: .5;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 20px;
          padding: 5px 12px;
          white-space: nowrap;
          flex-shrink: 0;
          text-transform: capitalize;
        }
        .status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }

        /* ── Main ── */
        .main {
          flex: 1;
          padding: 32px 28px 60px;
          max-width: 1100px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }

        /* ── Overview ── */
        .overview { display: flex; flex-direction: column; gap: 20px; }

        .row-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .row-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .7px;
          opacity: .35;
        }
        .text-btn {
          background: none;
          border: none;
          color: #E6E6E6;
          font-size: 12px;
          opacity: .35;
          cursor: pointer;
          padding: 0;
          transition: opacity .15s;
        }
        .text-btn:hover { opacity: .7; }

        /* Service cards row */
        .service-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .service-card {
          background: #13161C;
          border: 1px solid rgba(255,255,255,.07);
          border-top: 2px solid var(--c);
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 180px;
        }
        .svc-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .svc-name { font-size: 14px; font-weight: 700; }
        .svc-sub  { font-size: 10px; opacity: .35; text-transform: uppercase; letter-spacing: .5px; margin-top: 2px; }
        .svc-status {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 600;
          opacity: .6;
        }
        .svc-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.4; transform:scale(.8); }
        }

        /* Stats */
        .stats {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 14px;
        }
        .stat {
          background: #13161C;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 14px;
          padding: 20px 22px;
        }
        .stat-n {
          font-size: 30px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -.5px;
        }
        .stat-u { font-size: 14px; font-weight: 500; opacity: .5; }
        .stat-l {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .5px;
          opacity: .35;
          margin-top: 8px;
        }

        /* Log */
        .log-card {
          background: #13161C;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 14px;
          overflow: hidden;
        }
        .log-head {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .log-title { font-size: 13px; font-weight: 600; }
        .log-ct    { font-size: 11px; opacity: .3; }
        .live {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .8px;
          color: #00E5A0;
        }
        .live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #00E5A0;
          animation: pulse 2s ease-in-out infinite;
        }
        .log-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 48px 20px;
          text-align: center;
        }
        .log-empty p { margin: 0; font-size: 13px; opacity: .3; max-width: 280px; line-height: 1.6; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
        th {
          text-align: left;
          padding: 10px 16px;
          font-size: 10.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .5px;
          opacity: .3;
          border-bottom: 1px solid rgba(255,255,255,.05);
        }
        td {
          padding: 10px 16px;
          border-bottom: 1px solid rgba(255,255,255,.03);
        }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(255,255,255,.02); }
        .td-dim  { opacity: .4; font-variant-numeric: tabular-nums; white-space: nowrap; }
        .td-path { font-family: monospace; font-size: 12px; opacity: .7; }
        .badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
          letter-spacing: .3px;
        }
        .m-get    { background: rgba(66,133,244,.15);  color: #4285F4; }
        .m-post   { background: rgba(0,229,160,.12);   color: #00E5A0; }
        .m-put    { background: rgba(245,166,35,.12);  color: #F5A623; }
        .m-delete { background: rgba(255,77,77,.12);   color: #FF4D4D; }
        .m-patch  { background: rgba(138,99,255,.12);  color: #8A63FF; }
        .s-ok   { background: rgba(0,229,160,.12);  color: #00E5A0; }
        .s-warn { background: rgba(245,166,35,.12); color: #F5A623; }
        .s-err  { background: rgba(255,77,77,.12);  color: #FF4D4D; }

        /* ── Connections tab ── */
        .connections { display: flex; flex-direction: column; gap: 20px; }
        .conn-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .conn-card {
          background: #13161C;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: border-color .2s;
        }
        .conn-on { border-color: rgba(0,229,160,.2); }
        .cc-brand { display: flex; align-items: center; gap: 12px; }
        .cc-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .openai-icon  { background: rgba(16,163,127,.15); color: #10A37F; }
        .claude-icon  { background: rgba(217,117,89,.15);  color: #D97559; }
        .grok-icon    { background: rgba(138,99,255,.15);  color: #8A63FF; }
        .gemini-icon  { background: rgba(66,133,244,.15);  color: #4285F4; }
        .cc-name { font-size: 15px; font-weight: 700; }
        .cc-sub  { font-size: 11px; opacity: .35; text-transform: uppercase; letter-spacing: .5px; margin-top: 2px; }
        .conn-badge {
          margin-left: auto;
          font-size: 10px;
          font-weight: 600;
          background: rgba(0,229,160,.12);
          color: #00E5A0;
          padding: 3px 9px;
          border-radius: 20px;
        }
        .cc-input {
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
        .cc-input:focus { border-color: rgba(255,255,255,.22); }
        .cc-input::placeholder { opacity: .28; }
        .cc-error { margin: -4px 0 0; font-size: 12px; color: #FF4D4D; }
        .cc-btn {
          width: 100%;
          padding: 11px;
          border: none;
          border-radius: 9px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity .15s, transform .1s;
        }
        .cc-btn:hover { opacity: .88; transform: translateY(-1px); }
        .cc-btn:active { transform: translateY(0); }
        .btn-openai { background: #10A37F; color: #fff; }
        .btn-claude { background: #D97559; color: #fff; }
        .btn-grok   { background: #8A63FF; color: #fff; }
        .btn-gemini { background: #4285F4; color: #fff; }
        .cc-link {
          font-size: 12px; color: inherit; opacity: .25;
          text-decoration: none; text-align: center;
          transition: opacity .15s;
        }
        .cc-link:hover { opacity: .55; }
        .conn-active {
          display: flex; flex-direction: column; align-items: center;
          gap: 10px; padding: 10px 0; text-align: center;
        }
        .conn-check {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(0,229,160,.1); color: #00E5A0;
          font-size: 19px; display: flex; align-items: center; justify-content: center;
        }
        .conn-active p { margin: 0; font-size: 13px; opacity: .4; }
        .ghost-btn {
          background: none;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 8px;
          padding: 7px 18px;
          color: #E6E6E6;
          font-size: 12px;
          cursor: pointer;
          opacity: .42;
          transition: opacity .15s;
        }
        .ghost-btn:hover { opacity: .72; }

        /* ── Responsive ── */
        @media (max-width: 720px) {
          .main { padding: 20px 16px 48px; }
          .stats { grid-template-columns: 1fr 1fr; }
          .conn-grid { grid-template-columns: 1fr; }
          .header { padding: 0 16px; }
        }
        @media (max-width: 480px) {
          .stats { grid-template-columns: 1fr 1fr; }
          .service-row { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
