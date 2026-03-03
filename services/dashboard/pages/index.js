import { useEffect, useState } from "react";

export default function Home() {
  const [proxyStatus, setProxyStatus] = useState("checking");
  const [chatgptKey, setChatgptKey] = useState("");
  const [claudeKey, setClaudeKey] = useState("");
  const [chatgptConnected, setChatgptConnected] = useState(false);
  const [claudeConnected, setClaudeConnected] = useState(false);
  const [chatgptError, setChatgptError] = useState("");
  const [claudeError, setClaudeError] = useState("");

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

  const connectChatGPT = () => {
    if (!chatgptKey.trim()) { setChatgptError("Please enter your API key"); return; }
    if (!chatgptKey.startsWith("sk-")) { setChatgptError("Invalid key — should start with sk-"); return; }
    setChatgptError("");
    setChatgptConnected(true);
  };

  const connectClaude = () => {
    if (!claudeKey.trim()) { setClaudeError("Please enter your API key"); return; }
    if (!claudeKey.startsWith("sk-ant-")) { setClaudeError("Invalid key — should start with sk-ant-"); return; }
    setClaudeError("");
    setClaudeConnected(true);
  };

  const dot = { online: "#00E5A0", degraded: "#F5A623", offline: "#FF4D4D", checking: "#888" }[proxyStatus];

  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <img src="/logo.png" alt="GHST AI" className="logo" />
        <div className="status-chip">
          <span className="status-dot" style={{ background: dot }} />
          System {proxyStatus}
        </div>
      </header>

      {/* Hero */}
      <div className="hero">
        <h1 className="hero-title">Connect Your AI</h1>
        <p className="hero-sub">Link your API keys to start routing requests through GHST AI</p>
      </div>

      {/* Connect Cards */}
      <div className="cards">
        {/* ChatGPT */}
        <div className={`card ${chatgptConnected ? "card-connected" : ""}`}>
          <div className="card-brand">
            <div className="brand-icon openai-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.28 9.28a5.76 5.76 0 0 0-.49-4.73 5.82 5.82 0 0 0-6.27-2.8A5.76 5.76 0 0 0 11.2 0a5.82 5.82 0 0 0-5.55 4.03 5.76 5.76 0 0 0-3.84 2.8 5.82 5.82 0 0 0 .72 6.82 5.76 5.76 0 0 0 .49 4.73 5.82 5.82 0 0 0 6.27 2.8A5.76 5.76 0 0 0 12.8 24a5.82 5.82 0 0 0 5.55-4.04 5.76 5.76 0 0 0 3.84-2.79 5.82 5.82 0 0 0-.71-6.89zM12.8 22.4a4.32 4.32 0 0 1-2.77-1c.03-.02.09-.05.13-.08l4.6-2.66a.76.76 0 0 0 .38-.66v-6.5l1.95 1.12a.07.07 0 0 1 .04.05v5.38A4.34 4.34 0 0 1 12.8 22.4zm-9.33-3.97a4.32 4.32 0 0 1-.52-2.91c.03.02.09.06.13.08l4.6 2.66c.23.14.52.14.76 0l5.62-3.24v2.24a.07.07 0 0 1-.03.06L9.4 20.04a4.34 4.34 0 0 1-5.93-1.6zm-1.21-9.52a4.32 4.32 0 0 1 2.25-1.9v5.48a.75.75 0 0 0 .38.65l5.62 3.24-1.95 1.12a.07.07 0 0 1-.07 0L4.07 14.9A4.34 4.34 0 0 1 2.26 8.9zm16.04 3.73-5.62-3.24 1.95-1.12a.07.07 0 0 1 .07 0l4.43 2.56a4.34 4.34 0 0 1-.67 7.83v-5.48a.75.75 0 0 0-.16-.55zm1.94-2.93c-.03-.02-.09-.06-.13-.08l-4.6-2.65a.76.76 0 0 0-.76 0L9.13 10.2V7.96a.07.07 0 0 1 .03-.06l4.43-2.56a4.34 4.34 0 0 1 6.45 4.49l-.8.81zm-12.18 4-1.95-1.13a.07.07 0 0 1-.04-.05V7.14a4.34 4.34 0 0 1 7.12-3.33c-.03.02-.09.05-.13.07l-4.6 2.66a.76.76 0 0 0-.38.66l-.02 6.5zm1.06-2.28 2.5-1.44 2.5 1.44v2.88l-2.5 1.44-2.5-1.44V12.4z"/>
              </svg>
            </div>
            <div>
              <div className="brand-name">ChatGPT</div>
              <div className="brand-sub">OpenAI API</div>
            </div>
            {chatgptConnected && <span className="connected-badge">Connected</span>}
          </div>

          {!chatgptConnected ? (
            <>
              <p className="card-desc">Enter your OpenAI API key to route ChatGPT requests through GHST AI.</p>
              <input
                className="key-input"
                type="password"
                placeholder="sk-..."
                value={chatgptKey}
                onChange={e => { setChatgptKey(e.target.value); setChatgptError(""); }}
                onKeyDown={e => e.key === "Enter" && connectChatGPT()}
              />
              {chatgptError && <p className="error-msg">{chatgptError}</p>}
              <button className="btn btn-openai" onClick={connectChatGPT}>Connect ChatGPT</button>
              <a className="help-link" href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">
                Get your API key →
              </a>
            </>
          ) : (
            <div className="connected-state">
              <div className="connected-icon">✓</div>
              <p>ChatGPT is connected and routing through GHST AI.</p>
              <button className="btn-ghost" onClick={() => { setChatgptConnected(false); setChatgptKey(""); }}>
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Claude */}
        <div className={`card ${claudeConnected ? "card-connected" : ""}`}>
          <div className="card-brand">
            <div className="brand-icon claude-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.3 2H6.7L2 12l4.7 10h10.6L24 12 17.3 2zM12 16.5c-2.5 0-4.5-2-4.5-4.5S9.5 7.5 12 7.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5z"/>
              </svg>
            </div>
            <div>
              <div className="brand-name">Claude</div>
              <div className="brand-sub">Anthropic API</div>
            </div>
            {claudeConnected && <span className="connected-badge">Connected</span>}
          </div>

          {!claudeConnected ? (
            <>
              <p className="card-desc">Enter your Anthropic API key to route Claude requests through GHST AI.</p>
              <input
                className="key-input"
                type="password"
                placeholder="sk-ant-..."
                value={claudeKey}
                onChange={e => { setClaudeKey(e.target.value); setClaudeError(""); }}
                onKeyDown={e => e.key === "Enter" && connectClaude()}
              />
              {claudeError && <p className="error-msg">{claudeError}</p>}
              <button className="btn btn-claude" onClick={connectClaude}>Connect Claude</button>
              <a className="help-link" href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">
                Get your API key →
              </a>
            </>
          ) : (
            <div className="connected-state">
              <div className="connected-icon">✓</div>
              <p>Claude is connected and routing through GHST AI.</p>
              <button className="btn-ghost" onClick={() => { setClaudeConnected(false); setClaudeKey(""); }}>
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #0F1115;
          color: #E6E6E6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 24px 60px;
        }

        .header {
          width: 100%;
          max-width: 860px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 0 0;
        }
        .logo {
          height: 40px;
          width: auto;
          object-fit: contain;
          filter: invert(1);
        }
        .status-chip {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          opacity: 0.55;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 20px;
          padding: 6px 14px;
        }
        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
        }

        .hero {
          text-align: center;
          padding: 64px 0 48px;
        }
        .hero-title {
          margin: 0 0 12px;
          font-size: 38px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .hero-sub {
          margin: 0;
          font-size: 16px;
          opacity: 0.45;
        }

        .cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          width: 100%;
          max-width: 860px;
        }

        .card {
          background: #14171C;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 16px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: border-color .2s;
        }
        .card-connected {
          border-color: rgba(0,229,160,.25);
        }

        .card-brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .brand-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .openai-icon { background: #10A37F22; color: #10A37F; }
        .claude-icon  { background: #D9755922; color: #D97559; }

        .brand-name { font-size: 17px; font-weight: 700; }
        .brand-sub  { font-size: 12px; opacity: 0.4; margin-top: 2px; }

        .connected-badge {
          margin-left: auto;
          font-size: 11px;
          font-weight: 600;
          background: rgba(0,229,160,.12);
          color: #00E5A0;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: .4px;
        }

        .card-desc {
          margin: 0;
          font-size: 14px;
          opacity: 0.5;
          line-height: 1.5;
        }

        .key-input {
          width: 100%;
          background: #0F1115;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 14px;
          color: #E6E6E6;
          font-family: monospace;
          outline: none;
          box-sizing: border-box;
          transition: border-color .15s;
        }
        .key-input:focus { border-color: rgba(255,255,255,.25); }
        .key-input::placeholder { opacity: 0.3; }

        .error-msg {
          margin: -4px 0 0;
          font-size: 12px;
          color: #FF4D4D;
        }

        .btn {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity .15s;
        }
        .btn:hover { opacity: 0.85; }
        .btn-openai { background: #10A37F; color: #fff; }
        .btn-claude { background: #D97559; color: #fff; }

        .help-link {
          font-size: 12px;
          color: inherit;
          opacity: 0.35;
          text-decoration: none;
          text-align: center;
        }
        .help-link:hover { opacity: 0.6; }

        .connected-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 16px 0;
          text-align: center;
        }
        .connected-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(0,229,160,.12);
          color: #00E5A0;
          font-size: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .connected-state p { margin: 0; font-size: 14px; opacity: 0.55; }

        .btn-ghost {
          background: none;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 8px;
          padding: 8px 20px;
          color: #E6E6E6;
          font-size: 13px;
          cursor: pointer;
          opacity: 0.5;
          transition: opacity .15s;
        }
        .btn-ghost:hover { opacity: 0.8; }

        @media (max-width: 600px) {
          .cards { grid-template-columns: 1fr; }
          .hero-title { font-size: 28px; }
        }
      `}</style>
    </div>
  );
}
