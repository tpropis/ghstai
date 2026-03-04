import { useEffect, useState, useRef } from "react";

// ── Provider config ──────────────────────────────────────────────────────────
const PROVIDERS = [
  {
    id: "chatgpt", name: "ChatGPT", sub: "OpenAI",
    color: "#10A37F", btnClass: "btn-openai",
    placeholder: "sk-...", hint: "Starts with sk-",
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
    placeholder: "sk-ant-...", hint: "Starts with sk-ant-",
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
    placeholder: "xai-...", hint: "Starts with xai-",
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
    placeholder: "AIza...", hint: "Starts with AIza",
    link: "https://aistudio.google.com/app/apikey",
    iconClass: "gemini-icon",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
      </svg>
    ),
  },
];

// Typewriter hook
function useTypewriter(lines, started) {
  const [display, setDisplay] = useState([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!started || done) return;
    if (lineIdx >= lines.length) { setDone(true); return; }
    const line = lines[lineIdx];
    if (charIdx < line.length) {
      const t = setTimeout(() => {
        setDisplay(d => {
          const next = [...d];
          next[lineIdx] = (next[lineIdx] || "") + line[charIdx];
          return next;
        });
        setCharIdx(c => c + 1);
      }, line[charIdx] === " " ? 40 : 55);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setLineIdx(l => l + 1); setCharIdx(0); }, 500);
      return () => clearTimeout(t);
    }
  }, [started, lineIdx, charIdx, done, lines]);

  return { display, done };
}

function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

function maskKey(k) {
  if (!k || k.length < 8) return "••••••••";
  return k.slice(0, 6) + "••••••" + k.slice(-4);
}

const INTRO_LINES = [
  "Welcome.",
  "Every API call you make is being logged.",
  "OpenAI knows. Anthropic knows. Google knows.",
  "BOO — they're watching.",
  "GHST routes your traffic so they can't.",
];

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Home() {
  // "welcome" → "connect" → "dashboard"
  const [screen, setScreen]   = useState("welcome");
  const [tab, setTab]         = useState("overview");
  const [introStarted, setIntroStarted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const { display, done: introDone } = useTypewriter(INTRO_LINES, introStarted);

  const [proxyStatus, setProxyStatus] = useState("checking");
  const [metrics, setMetrics]         = useState({ total_requests: 0, success_rate: 100, avg_latency_ms: 0, errors: 0 });
  const [reqLogs, setReqLogs]         = useState([]);
  const [, setTick]                   = useState(0);

  const [keys,      setKeys]      = useState({ chatgpt: "", claude: "", grok: "", gemini: "" });
  const [connected, setConnected] = useState({ chatgpt: false, claude: false, grok: false, gemini: false });
  const [errors,    setErrors]    = useState({ chatgpt: "", claude: "", grok: "", gemini: "" });
  const [shake,     setShake]     = useState({ chatgpt: false, claude: false, grok: false, gemini: false });

  // Start intro on mount
  useEffect(() => {
    const t = setTimeout(() => setIntroStarted(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Poll proxy
  useEffect(() => {
    const refresh = () => {
      fetch("/api/status").then(r => r.json())
        .then(d => setProxyStatus(d.status === "healthy" ? "online" : "degraded"))
        .catch(() => setProxyStatus("offline"));
      fetch("/api/metrics").then(r => r.json()).then(setMetrics).catch(() => {});
      fetch("/api/logs?limit=100").then(r => r.json())
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

  const goToConnect = () => {
    setFadeOut(true);
    setTimeout(() => { setScreen("connect"); setFadeOut(false); }, 500);
  };

  const handleConnect = (id) => {
    const key = keys[id].trim();
    if (!key) {
      setErrors(e => ({ ...e, [id]: "Enter your API key first" }));
      setShake(s => ({ ...s, [id]: true }));
      setTimeout(() => setShake(s => ({ ...s, [id]: false })), 500);
      return;
    }
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
  const errColor           = metrics.errors === 0 ? "#00E5A0" : metrics.errors < 5 ? "#F5A623" : "#FF4D4D";

  const providerLog = {};
  PROVIDERS.forEach(p => {
    const entries = reqLogs.filter(l => l.path && l.path.includes(p.id));
    providerLog[p.id] = { count: entries.length, errors: entries.filter(l => l.status >= 400).length };
  });

  // ── WELCOME SCREEN ────────────────────────────────────────────────────────
  if (screen === "welcome") {
    return (
      <div className={`welcome-page ${fadeOut ? "fade-out" : ""}`}>
        <div className="welcome-inner">
          <div className="ghost-eye">
            <div className="eye-outer">
              <div className="eye-inner" />
            </div>
          </div>

          <div className="terminal">
            {INTRO_LINES.map((_, i) => (
              <div
                key={i}
                className={`terminal-line ${i === 0 ? "line-welcome" : i === 4 ? "line-boo" : "line-body"}`}
                style={{ opacity: display[i] !== undefined ? 1 : 0 }}
              >
                {i === 4 && display[i] && <span className="boo-prefix">👻 </span>}
                {display[i] || ""}
                {i === lineIdx(display) && introStarted && !introDone && <span className="cursor">█</span>}
              </div>
            ))}
          </div>

          {introDone && (
            <button className="start-btn" onClick={goToConnect}>
              Take back control
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          )}
        </div>

        <div className="scanline" />
        <div className="corner tl" /><div className="corner tr" />
        <div className="corner bl" /><div className="corner br" />

        <style jsx>{`
          .welcome-page {
            min-height: 100vh;
            background: #050608;
            display: flex; align-items: center; justify-content: center;
            font-family: 'Courier New', Courier, monospace;
            overflow: hidden;
            transition: opacity .5s;
          }
          .welcome-page.fade-out { opacity: 0; }

          .welcome-inner {
            display: flex; flex-direction: column; align-items: center;
            gap: 40px; padding: 40px 24px;
            max-width: 560px; width: 100%;
          }

          /* Ghost eye */
          .ghost-eye {
            position: relative;
            animation: float 3s ease-in-out infinite;
          }
          .eye-outer {
            width: 80px; height: 80px; border-radius: 50%;
            border: 2px solid rgba(0,229,160,.3);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 0 40px rgba(0,229,160,.08), inset 0 0 20px rgba(0,229,160,.04);
          }
          .eye-inner {
            width: 28px; height: 28px; border-radius: 50%;
            background: #00E5A0;
            box-shadow: 0 0 20px rgba(0,229,160,.8);
            animation: blink 4s ease-in-out infinite;
          }
          @keyframes float {
            0%,100% { transform: translateY(0); }
            50%      { transform: translateY(-8px); }
          }
          @keyframes blink {
            0%,90%,100% { transform: scaleY(1); }
            95%          { transform: scaleY(0.05); }
          }

          /* Terminal */
          .terminal {
            display: flex; flex-direction: column; gap: 14px;
            width: 100%;
          }
          .terminal-line {
            transition: opacity .3s;
            line-height: 1.4;
          }
          .line-welcome {
            font-size: 13px; color: rgba(255,255,255,.35);
            letter-spacing: .2em; text-transform: uppercase;
          }
          .line-body {
            font-size: 16px; color: rgba(255,255,255,.65);
          }
          .line-boo {
            font-size: 22px; font-weight: bold; color: #00E5A0;
            text-shadow: 0 0 20px rgba(0,229,160,.5);
            letter-spacing: .02em;
          }
          .cursor {
            display: inline-block;
            animation: blink-cursor .8s step-end infinite;
            color: #00E5A0;
            font-size: .9em;
          }
          @keyframes blink-cursor { 0%,100% { opacity:1; } 50% { opacity:0; } }

          /* CTA */
          .start-btn {
            display: flex; align-items: center; gap: 10px;
            background: none;
            border: 1px solid rgba(0,229,160,.4);
            border-radius: 10px;
            padding: 14px 28px;
            color: #00E5A0; font-size: 14px; font-weight: 600;
            font-family: 'Courier New', Courier, monospace;
            cursor: pointer; letter-spacing: .05em;
            transition: background .2s, border-color .2s, box-shadow .2s;
            animation: fade-in .5s ease both;
          }
          .start-btn:hover {
            background: rgba(0,229,160,.07);
            border-color: rgba(0,229,160,.7);
            box-shadow: 0 0 20px rgba(0,229,160,.15);
          }
          @keyframes fade-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }

          /* Decorative scanlines */
          .scanline {
            position: fixed; inset: 0; pointer-events: none;
            background: repeating-linear-gradient(
              0deg,
              rgba(0,0,0,0) 0px,
              rgba(0,0,0,0) 2px,
              rgba(0,0,0,.04) 2px,
              rgba(0,0,0,.04) 4px
            );
          }
          .corner {
            position: fixed; width: 20px; height: 20px;
            border-color: rgba(0,229,160,.2); border-style: solid;
          }
          .tl { top: 20px; left: 20px; border-width: 1px 0 0 1px; }
          .tr { top: 20px; right: 20px; border-width: 1px 1px 0 0; }
          .bl { bottom: 20px; left: 20px; border-width: 0 0 1px 1px; }
          .br { bottom: 20px; right: 20px; border-width: 0 1px 1px 0; }
        `}</style>
      </div>
    );
  }

  // ── CONNECT SCREEN ────────────────────────────────────────────────────────
  if (screen === "connect") {
    return (
      <div className="connect-page">
        <div className="connect-inner">
          <div className="connect-logo">
            <img src="/logo.png" alt="GHST AI" />
          </div>
          <h1 className="connect-title">Connect a provider</h1>
          <p className="connect-sub">Enter your API key. GHST proxies your calls — they see the request, not you.</p>

          <div className="connect-grid">
            {PROVIDERS.map(p => (
              <div key={p.id} className={`connect-card ${connected[p.id] ? "card-connected" : ""}`} style={{ "--c": p.color }}>
                {connected[p.id] && <div className="card-connected-bar" style={{ background: p.color }} />}
                <div className="cc-brand">
                  <div className={`cc-icon ${p.iconClass}`}>{p.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div className="cc-name">{p.name}</div>
                    <div className="cc-sub">{p.sub}</div>
                  </div>
                  {connected[p.id] && <span className="connected-pill">● Connected</span>}
                </div>

                {!connected[p.id] ? (
                  <>
                    <div className={`cc-input-wrap ${shake[p.id] ? "shake" : ""}`}>
                      <input
                        className={`cc-input ${errors[p.id] ? "cc-input-err" : ""}`}
                        type="password"
                        placeholder={p.placeholder}
                        value={keys[p.id]}
                        onChange={e => { setKeys(k => ({ ...k, [p.id]: e.target.value })); setErrors(err => ({ ...err, [p.id]: "" })); }}
                        onKeyDown={e => e.key === "Enter" && handleConnect(p.id)}
                      />
                      <div className="cc-meta">
                        <span className="cc-hint">{p.hint}</span>
                        {errors[p.id] && <span className="cc-error">{errors[p.id]}</span>}
                      </div>
                    </div>
                    <button className={`cc-btn ${p.btnClass}`} onClick={() => handleConnect(p.id)}>
                      Connect {p.name}
                    </button>
                    <a className="cc-link" href={p.link} target="_blank" rel="noreferrer">Get your API key →</a>
                  </>
                ) : (
                  <div className="mini-connected">
                    <span style={{ fontSize: 13, opacity: .5 }}>{p.name} is routing through GHST.</span>
                    <button className="ghost-btn-sm" onClick={() => handleDisconnect(p.id)}>Disconnect</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {connectedCount > 0 && (
            <button className="go-btn" onClick={() => { setScreen("dashboard"); setTab("overview"); }}>
              Go to dashboard ({connectedCount} connected)
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          )}
        </div>

        <style jsx>{`
          .connect-page {
            min-height: 100vh;
            background: #0A0C10;
            color: #E6E6E6;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex; align-items: center; justify-content: center;
            padding: 40px 20px; box-sizing: border-box;
          }
          .connect-inner {
            width: 100%; max-width: 800px;
            display: flex; flex-direction: column; align-items: center;
            gap: 0;
          }
          .connect-logo img { height: 36px; width: auto; filter: invert(1); opacity: .9; }
          .connect-title { margin: 28px 0 8px; font-size: 26px; font-weight: 800; letter-spacing: -.5px; }
          .connect-sub { margin: 0 0 36px; font-size: 13px; opacity: .4; text-align: center; max-width: 440px; line-height: 1.6; }

          .connect-grid {
            display: grid; grid-template-columns: 1fr 1fr;
            gap: 16px; width: 100%; margin-bottom: 24px;
          }
          .connect-card {
            background: #13161C;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 16px; padding: 24px;
            display: flex; flex-direction: column; gap: 14px;
            position: relative; overflow: hidden;
            transition: border-color .2s;
          }
          .connect-card.card-connected { border-color: rgba(0,229,160,.15); }
          .card-connected-bar {
            position: absolute; top: 0; left: 0; right: 0; height: 2px;
          }
          .cc-brand { display: flex; align-items: center; gap: 12px; }
          .cc-icon {
            width: 40px; height: 40px; border-radius: 10px;
            display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          }
          .openai-icon  { background: rgba(16,163,127,.15); color: #10A37F; }
          .claude-icon  { background: rgba(217,117,89,.15);  color: #D97559; }
          .grok-icon    { background: rgba(138,99,255,.15);  color: #8A63FF; }
          .gemini-icon  { background: rgba(66,133,244,.15);  color: #4285F4; }
          .cc-name { font-size: 15px; font-weight: 700; }
          .cc-sub  { font-size: 11px; opacity: .35; text-transform: uppercase; letter-spacing: .5px; margin-top: 2px; }
          .connected-pill { font-size: 11px; font-weight: 600; color: #00E5A0; white-space: nowrap; }

          .cc-input-wrap { display: flex; flex-direction: column; gap: 6px; }
          .cc-input {
            width: 100%; background: #0A0C10;
            border: 1px solid rgba(255,255,255,.09); border-radius: 9px;
            padding: 10px 12px; font-size: 13px; color: #E6E6E6;
            font-family: monospace; outline: none; box-sizing: border-box;
            transition: border-color .15s;
          }
          .cc-input:focus { border-color: rgba(255,255,255,.22); }
          .cc-input::placeholder { opacity: .28; }
          .cc-input-err { border-color: rgba(255,77,77,.5) !important; }
          .cc-meta { display: flex; justify-content: space-between; align-items: center; }
          .cc-hint  { font-size: 11px; opacity: .25; }
          .cc-error { font-size: 11px; color: #FF4D4D; }
          .cc-input-wrap.shake { animation: shake .4s ease; }
          @keyframes shake {
            0%,100% { transform: translateX(0); }
            20%      { transform: translateX(-6px); }
            40%      { transform: translateX(6px); }
            60%      { transform: translateX(-4px); }
            80%      { transform: translateX(4px); }
          }
          .cc-btn {
            width: 100%; padding: 11px; border: none; border-radius: 9px;
            font-size: 13.5px; font-weight: 600; cursor: pointer;
            transition: opacity .15s, transform .1s;
          }
          .cc-btn:hover  { opacity: .88; transform: translateY(-1px); }
          .cc-btn:active { transform: translateY(0); }
          .btn-openai { background: #10A37F; color: #fff; }
          .btn-claude { background: #D97559; color: #fff; }
          .btn-grok   { background: #8A63FF; color: #fff; }
          .btn-gemini { background: #4285F4; color: #fff; }
          .cc-link {
            font-size: 12px; color: inherit; opacity: .22;
            text-decoration: none; text-align: center; transition: opacity .15s;
          }
          .cc-link:hover { opacity: .5; }

          .mini-connected {
            display: flex; align-items: center; justify-content: space-between;
            gap: 12px; padding: 4px 0;
          }
          .ghost-btn-sm {
            background: none; border: 1px solid rgba(255,255,255,.1);
            border-radius: 7px; padding: 5px 12px;
            color: #E6E6E6; font-size: 11px; cursor: pointer;
            opacity: .4; transition: opacity .15s; white-space: nowrap;
          }
          .ghost-btn-sm:hover { opacity: .7; }

          .go-btn {
            display: flex; align-items: center; gap: 10px;
            background: #00E5A0; color: #000;
            border: none; border-radius: 12px;
            padding: 14px 28px; font-size: 14px; font-weight: 700;
            cursor: pointer; transition: opacity .15s, transform .1s;
          }
          .go-btn:hover  { opacity: .9; transform: translateY(-1px); }
          .go-btn:active { transform: translateY(0); }

          @media (max-width: 560px) {
            .connect-grid { grid-template-columns: 1fr; }
            .connect-title { font-size: 22px; }
          }
        `}</style>
      </div>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────────────────────────
  return (
    <div className="app">

      <header className="header">
        <img src="/logo.png" alt="GHST AI" className="logo" />
        <nav className="nav">
          {["overview", "connections", "keys"].map(t => (
            <button key={t} className={`nav-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === "connections" && <span className="nav-count">{connectedCount}</span>}
            </button>
          ))}
        </nav>
        <div className="status-pill">
          <span className="status-dot" style={{ background: statusColor }} />
          {proxyStatus}
        </div>
      </header>

      <main className="main">

        {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
        {tab === "overview" && (
          <div className="overview">

            {/* Provider chips */}
            <div className="provider-strip">
              {connectedProviders.map(p => (
                <div key={p.id} className="provider-chip" style={{ "--c": p.color }}>
                  <span className="chip-dot" style={{ background: p.color }} />
                  <span className={`chip-icon ${p.iconClass}`}>{p.icon}</span>
                  <span className="chip-name">{p.name}</span>
                  <span className="chip-badge">routing</span>
                </div>
              ))}
              <button className="chip-add" onClick={() => setTab("connections")}>+ Add provider</button>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              {[
                { label: "Total requests", value: metrics.total_requests.toLocaleString(), sub: "through GHST", color: null },
                { label: "Success rate",   value: metrics.success_rate, unit: "%", sub: `${metrics.errors} errors`, color: srColor },
                { label: "Avg latency",    value: metrics.avg_latency_ms, unit: "ms", sub: "end-to-end", color: null },
                { label: "Errors",         value: metrics.errors, sub: "4xx / 5xx", color: errColor },
                { label: "Providers",      value: `${connectedCount}/${PROVIDERS.length}`, sub: "connected", color: null },
                { label: "Proxy",          value: proxyStatus, sub: "health", color: statusColor, capitalize: true },
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value" style={{ color: s.color || "inherit", textTransform: s.capitalize ? "capitalize" : "none" }}>
                    {s.value}{s.unit && <span className="stat-unit">{s.unit}</span>}
                  </div>
                  <div className="stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Provider breakdown */}
            {connectedProviders.length > 0 && (
              <div className="section">
                <div className="section-head">Active providers</div>
                <div className="breakdown-grid">
                  {connectedProviders.map(p => (
                    <div key={p.id} className="breakdown-card" style={{ "--c": p.color }}>
                      <div className="bk-top">
                        <div className={`bk-icon ${p.iconClass}`}>{p.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div className="bk-name">{p.name}</div>
                          <div className="bk-sub">{p.sub}</div>
                        </div>
                        <span className="bk-live">
                          <span className="bk-dot" style={{ background: p.color }} />
                          live
                        </span>
                      </div>
                      <div className="bk-stats">
                        <div className="bk-stat">
                          <span className="bk-n">{providerLog[p.id]?.count ?? 0}</span>
                          <span className="bk-l">requests</span>
                        </div>
                        <div className="bk-stat">
                          <span className="bk-n" style={{ color: (providerLog[p.id]?.errors ?? 0) > 0 ? "#FF4D4D" : "#00E5A0" }}>
                            {providerLog[p.id]?.errors ?? 0}
                          </span>
                          <span className="bk-l">errors</span>
                        </div>
                      </div>
                      <div className="bk-bar">
                        <div className="bk-bar-fill" style={{ background: p.color, width: "100%", opacity: .4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request log */}
            <div className="section">
              <div className="section-head">
                Live traffic
                <span className="log-count">{reqLogs.length}</span>
                <span className="live-badge"><span className="live-dot" />LIVE</span>
              </div>
              <div className="log-card">
                {reqLogs.length === 0 ? (
                  <div className="log-empty">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .15 }}>
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    <p>No traffic yet. Make an API call through GHST and it will appear here.</p>
                  </div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Time</th><th>Method</th><th>Path</th><th>Status</th><th>Latency</th></tr>
                      </thead>
                      <tbody>
                        {reqLogs.map((l, i) => (
                          <tr key={i} className={l.status >= 500 ? "row-err" : l.status >= 400 ? "row-warn" : ""}>
                            <td className="td-dim">{timeAgo(l.time)}</td>
                            <td><span className={`badge m-${l.method?.toLowerCase()}`}>{l.method}</span></td>
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
          </div>
        )}

        {/* ── CONNECTIONS ──────────────────────────────────────────────────── */}
        {tab === "connections" && (
          <div>
            <div className="section-head" style={{ marginBottom: 16 }}>
              Connections
              <span style={{ fontWeight: 400, opacity: .5 }}>{connectedCount}/{PROVIDERS.length} active</span>
            </div>
            <div className="conn-grid">
              {PROVIDERS.map(p => (
                <div key={p.id} className={`conn-card ${connected[p.id] ? "conn-on" : ""}`}>
                  <div className="cc-brand">
                    <div className={`cc-icon ${p.iconClass}`}>{p.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div className="cc-name">{p.name}</div>
                      <div className="cc-sub">{p.sub}</div>
                    </div>
                    {connected[p.id] && <span className="conn-pill">● Connected</span>}
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
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 11, opacity: .28 }}>{p.hint}</span>
                        {errors[p.id] && <span style={{ fontSize: 11, color: "#FF4D4D" }}>{errors[p.id]}</span>}
                      </div>
                      <button className={`cc-btn ${p.btnClass}`} onClick={() => handleConnect(p.id)}>Connect {p.name}</button>
                      <a className="cc-link" href={p.link} target="_blank" rel="noreferrer">Get your API key →</a>
                    </>
                  ) : (
                    <div className="conn-active">
                      <div className="conn-rows">
                        <div className="conn-row"><span className="cr-label">Status</span><span style={{ color: "#00E5A0", fontWeight: 600, fontSize: 12 }}>● Routing</span></div>
                        <div className="conn-row"><span className="cr-label">Requests</span><span className="cr-val">{providerLog[p.id]?.count ?? 0}</span></div>
                        <div className="conn-row"><span className="cr-label">Errors</span><span className="cr-val" style={{ color: (providerLog[p.id]?.errors ?? 0) > 0 ? "#FF4D4D" : "inherit" }}>{providerLog[p.id]?.errors ?? 0}</span></div>
                      </div>
                      <button className="ghost-btn" onClick={() => handleDisconnect(p.id)}>Disconnect</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── KEYS ─────────────────────────────────────────────────────────── */}
        {tab === "keys" && (
          <div>
            <div className="section-head" style={{ marginBottom: 16 }}>API Keys</div>
            {connectedProviders.length === 0 ? (
              <div className="empty-state">
                <p>No providers connected.</p>
                <button className="go-btn-sm" onClick={() => setTab("connections")}>Connect a provider</button>
              </div>
            ) : (
              <div className="keys-list">
                {connectedProviders.map(p => (
                  <div key={p.id} className="key-row">
                    <div className="key-brand">
                      <div className={`cc-icon ${p.iconClass}`} style={{ width: 32, height: 32, borderRadius: 8 }}>{p.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 10, opacity: .35, textTransform: "uppercase", letterSpacing: ".5px" }}>{p.sub}</div>
                      </div>
                    </div>
                    <div className="key-val">{maskKey(keys[p.id])}</div>
                    <div className="key-status" style={{ color: p.color }}>● Active</div>
                    <button className="ghost-btn" onClick={() => handleDisconnect(p.id)}>Revoke</button>
                  </div>
                ))}
                {PROVIDERS.filter(p => !connected[p.id]).length > 0 && (
                  <div className="key-row key-add-row" onClick={() => setTab("connections")}>
                    + Connect another provider
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <style jsx>{`
        .app {
          min-height: 100vh; background: #0A0C10; color: #E6E6E6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex; flex-direction: column;
        }

        /* Header */
        .header {
          position: sticky; top: 0; z-index: 100;
          height: 56px; display: flex; align-items: center; gap: 20px;
          padding: 0 28px;
          background: rgba(10,12,16,.95);
          border-bottom: 1px solid rgba(255,255,255,.06);
          backdrop-filter: blur(12px);
        }
        .logo { height: 24px; width: auto; filter: invert(1); opacity: .9; flex-shrink: 0; }
        .nav { display: flex; gap: 4px; flex: 1; }
        .nav-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 6px 14px; border: none; border-radius: 8px;
          background: none; color: #E6E6E6; font-size: 13px; font-weight: 500;
          cursor: pointer; opacity: .38; transition: opacity .15s, background .15s;
          text-transform: capitalize;
        }
        .nav-btn:hover  { opacity: .65; background: rgba(255,255,255,.05); }
        .nav-btn.active { opacity: 1;   background: rgba(255,255,255,.08); }
        .nav-count {
          font-size: 10px; font-weight: 700;
          background: rgba(0,229,160,.15); color: #00E5A0;
          padding: 1px 6px; border-radius: 20px;
        }
        .status-pill {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; opacity: .5;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 20px; padding: 5px 12px;
          white-space: nowrap; text-transform: capitalize;
        }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        /* Main */
        .main {
          flex: 1; padding: 28px 28px 60px;
          max-width: 1100px; width: 100%;
          margin: 0 auto; box-sizing: border-box;
        }

        /* Provider strip */
        .provider-strip { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; }
        .provider-chip {
          display: flex; align-items: center; gap: 8px;
          background: #13161C; border: 1px solid rgba(255,255,255,.07);
          border-left: 2px solid var(--c);
          border-radius: 10px; padding: 8px 14px;
          font-size: 13px; font-weight: 500;
        }
        .chip-dot { width: 6px; height: 6px; border-radius: 50%; animation: pulse 2s infinite; }
        .chip-icon { display: flex; align-items: center; }
        .chip-name { font-weight: 600; }
        .chip-badge {
          font-size: 9px; font-weight: 700; letter-spacing: .5px;
          color: #00E5A0; background: rgba(0,229,160,.1);
          padding: 2px 6px; border-radius: 4px;
        }
        .chip-add {
          background: none; border: 1px dashed rgba(255,255,255,.15);
          border-radius: 10px; padding: 8px 14px;
          color: #E6E6E6; font-size: 12px; opacity: .35;
          cursor: pointer; transition: opacity .15s;
        }
        .chip-add:hover { opacity: .65; }

        /* Stats */
        .stats-grid {
          display: grid; grid-template-columns: repeat(6, 1fr);
          gap: 12px; margin-bottom: 24px;
        }
        .stat-card {
          background: #13161C; border: 1px solid rgba(255,255,255,.07);
          border-radius: 14px; padding: 18px;
        }
        .stat-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .6px; opacity: .35; margin-bottom: 10px; }
        .stat-value { font-size: 26px; font-weight: 700; line-height: 1; letter-spacing: -.5px; }
        .stat-unit  { font-size: 13px; font-weight: 500; opacity: .5; margin-left: 2px; }
        .stat-sub   { font-size: 10px; opacity: .28; margin-top: 6px; }

        /* Section */
        .section { margin-bottom: 24px; }
        .section-head {
          display: flex; align-items: center; gap: 10px;
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: .7px;
          opacity: .4; margin-bottom: 12px;
        }
        .log-count { opacity: .7; }
        .live-badge {
          margin-left: auto; display: flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 700; letter-spacing: .8px;
          color: #00E5A0; opacity: 1;
        }
        .live-dot { width: 6px; height: 6px; border-radius: 50%; background: #00E5A0; animation: pulse 2s infinite; }

        /* Provider breakdown */
        .breakdown-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
        .breakdown-card {
          background: #13161C; border: 1px solid rgba(255,255,255,.07);
          border-top: 2px solid var(--c);
          border-radius: 14px; padding: 18px;
          display: flex; flex-direction: column; gap: 14px;
        }
        .bk-top { display: flex; align-items: center; gap: 10px; }
        .bk-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .bk-name { font-size: 14px; font-weight: 700; }
        .bk-sub  { font-size: 10px; opacity: .35; text-transform: uppercase; letter-spacing: .5px; }
        .bk-live { display: flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 600; opacity: .5; }
        .bk-dot  { width: 6px; height: 6px; border-radius: 50%; animation: pulse 2s infinite; }
        .bk-stats { display: flex; gap: 20px; }
        .bk-stat { display: flex; flex-direction: column; gap: 3px; }
        .bk-n { font-size: 22px; font-weight: 700; line-height: 1; }
        .bk-l { font-size: 10px; opacity: .3; text-transform: uppercase; letter-spacing: .4px; }
        .bk-bar { height: 3px; background: rgba(255,255,255,.06); border-radius: 2px; overflow: hidden; }
        .bk-bar-fill { height: 100%; border-radius: 2px; }

        /* Log */
        .log-card {
          background: #13161C; border: 1px solid rgba(255,255,255,.07);
          border-radius: 14px; overflow: hidden;
        }
        .log-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 56px 20px; text-align: center; }
        .log-empty p { margin: 0; font-size: 13px; opacity: .28; max-width: 300px; line-height: 1.7; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
        th {
          text-align: left; padding: 10px 16px;
          font-size: 10.5px; font-weight: 600; text-transform: uppercase;
          letter-spacing: .5px; opacity: .3;
          border-bottom: 1px solid rgba(255,255,255,.05);
        }
        td { padding: 9px 16px; border-bottom: 1px solid rgba(255,255,255,.03); }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(255,255,255,.02); }
        tr.row-err td  { background: rgba(255,77,77,.03); }
        tr.row-warn td { background: rgba(245,166,35,.03); }
        .td-dim  { opacity: .4; font-variant-numeric: tabular-nums; white-space: nowrap; }
        .td-path { font-family: monospace; font-size: 12px; opacity: .7; }
        .badge { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px; letter-spacing: .3px; }
        .m-get    { background: rgba(66,133,244,.15);  color: #4285F4; }
        .m-post   { background: rgba(0,229,160,.12);   color: #00E5A0; }
        .m-put    { background: rgba(245,166,35,.12);  color: #F5A623; }
        .m-delete { background: rgba(255,77,77,.12);   color: #FF4D4D; }
        .m-patch  { background: rgba(138,99,255,.12);  color: #8A63FF; }
        .s-ok   { background: rgba(0,229,160,.12);  color: #00E5A0; }
        .s-warn { background: rgba(245,166,35,.12); color: #F5A623; }
        .s-err  { background: rgba(255,77,77,.12);  color: #FF4D4D; }

        /* Connections */
        .conn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .conn-card {
          background: #13161C; border: 1px solid rgba(255,255,255,.07);
          border-radius: 16px; padding: 24px;
          display: flex; flex-direction: column; gap: 14px;
          transition: border-color .2s;
        }
        .conn-on { border-color: rgba(0,229,160,.15); }
        .cc-brand { display: flex; align-items: center; gap: 12px; }
        .cc-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .openai-icon  { background: rgba(16,163,127,.15); color: #10A37F; }
        .claude-icon  { background: rgba(217,117,89,.15);  color: #D97559; }
        .grok-icon    { background: rgba(138,99,255,.15);  color: #8A63FF; }
        .gemini-icon  { background: rgba(66,133,244,.15);  color: #4285F4; }
        .cc-name { font-size: 15px; font-weight: 700; }
        .cc-sub  { font-size: 11px; opacity: .35; text-transform: uppercase; letter-spacing: .5px; margin-top: 2px; }
        .conn-pill { font-size: 11px; font-weight: 600; color: #00E5A0; }
        .cc-input {
          width: 100%; background: #0A0C10; border: 1px solid rgba(255,255,255,.09);
          border-radius: 9px; padding: 10px 12px; font-size: 13px; color: #E6E6E6;
          font-family: monospace; outline: none; box-sizing: border-box; transition: border-color .15s;
        }
        .cc-input:focus { border-color: rgba(255,255,255,.22); }
        .cc-input::placeholder { opacity: .28; }
        .cc-btn {
          width: 100%; padding: 11px; border: none; border-radius: 9px;
          font-size: 13.5px; font-weight: 600; cursor: pointer;
          transition: opacity .15s, transform .1s;
        }
        .cc-btn:hover  { opacity: .88; transform: translateY(-1px); }
        .cc-btn:active { transform: translateY(0); }
        .btn-openai { background: #10A37F; color: #fff; }
        .btn-claude { background: #D97559; color: #fff; }
        .btn-grok   { background: #8A63FF; color: #fff; }
        .btn-gemini { background: #4285F4; color: #fff; }
        .cc-link { font-size: 12px; color: inherit; opacity: .22; text-decoration: none; text-align: center; transition: opacity .15s; }
        .cc-link:hover { opacity: .5; }
        .conn-active { display: flex; flex-direction: column; gap: 14px; padding: 4px 0; }
        .conn-rows { display: flex; flex-direction: column; gap: 10px; }
        .conn-row { display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
        .cr-label { opacity: .35; }
        .cr-val   { font-weight: 600; }
        .ghost-btn {
          background: none; border: 1px solid rgba(255,255,255,.1);
          border-radius: 8px; padding: 7px 18px;
          color: #E6E6E6; font-size: 12px; cursor: pointer;
          opacity: .42; transition: opacity .15s; align-self: flex-start;
        }
        .ghost-btn:hover { opacity: .72; }

        /* Keys */
        .keys-list { background: #13161C; border: 1px solid rgba(255,255,255,.07); border-radius: 14px; overflow: hidden; }
        .key-row { display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,.04); }
        .key-row:last-child { border-bottom: none; }
        .key-add-row { opacity: .3; font-size: 13px; cursor: pointer; justify-content: center; }
        .key-add-row:hover { opacity: .55; background: rgba(255,255,255,.02); }
        .key-brand { display: flex; align-items: center; gap: 10px; min-width: 140px; }
        .key-val { flex: 1; font-family: monospace; font-size: 12px; opacity: .45; letter-spacing: .05em; }
        .key-status { font-size: 11px; font-weight: 600; white-space: nowrap; }
        .empty-state { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 60px 20px; opacity: .45; text-align: center; }
        .empty-state p { margin: 0; font-size: 14px; }
        .go-btn-sm {
          background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1);
          border-radius: 9px; padding: 10px 20px;
          color: #E6E6E6; font-size: 13px; cursor: pointer; opacity: 1;
        }

        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.4; transform:scale(.8); }
        }

        @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 720px) {
          .main { padding: 20px 16px 48px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .conn-grid { grid-template-columns: 1fr; }
          .header { padding: 0 16px; }
        }
      `}</style>
    </div>
  );
}

// Helper to find current typing line index
function lineIdx(display) {
  return display.length > 0 ? display.length - 1 : 0;
}
