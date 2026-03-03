import { useEffect, useState } from "react";

export default function Home() {
  const [proxyStatus, setProxyStatus] = useState("checking");
  const [chatgptKey, setChatgptKey] = useState("");
  const [claudeKey, setClaudeKey] = useState("");
  const [grokKey, setGrokKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [chatgptConnected, setChatgptConnected] = useState(false);
  const [claudeConnected, setClaudeConnected] = useState(false);
  const [grokConnected, setGrokConnected] = useState(false);
  const [geminiConnected, setGeminiConnected] = useState(false);
  const [chatgptError, setChatgptError] = useState("");
  const [claudeError, setClaudeError] = useState("");
  const [grokError, setGrokError] = useState("");
  const [geminiError, setGeminiError] = useState("");

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

  const connectGrok = () => {
    if (!grokKey.trim()) { setGrokError("Please enter your API key"); return; }
    if (!grokKey.startsWith("xai-")) { setGrokError("Invalid key — should start with xai-"); return; }
    setGrokError("");
    setGrokConnected(true);
  };

  const connectGemini = () => {
    if (!geminiKey.trim()) { setGeminiError("Please enter your API key"); return; }
    if (!geminiKey.startsWith("AIza")) { setGeminiError("Invalid key — should start with AIza"); return; }
    setGeminiError("");
    setGeminiConnected(true);
  };

  const dot = { online: "#00E5A0", degraded: "#F5A623", offline: "#FF4D4D", checking: "#888" }[proxyStatus];

  return (
    <div className="page">
      {/* Status chip top-right */}
      <div className="top-bar">
        <div className="status-chip">
          <span className="status-dot" style={{ background: dot }} />
          System {proxyStatus}
        </div>
      </div>

      {/* Hero — logo front and center */}
      <div className="hero">
        <img src="/logo.png" alt="GHST AI" className="hero-logo" />
        <p className="hero-sub">Connect your AI providers and route requests through GHST AI</p>
      </div>

      {/* Connect Cards */}
      <div className="cards">

        {/* ChatGPT */}
        <div className={`card ${chatgptConnected ? "card-connected" : ""}`}>
          <div className="card-brand">
            <div className="brand-icon openai-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.28 9.28a5.76 5.76 0 0 0-.49-4.73 5.82 5.82 0 0 0-6.27-2.8A5.76 5.76 0 0 0 11.2 0a5.82 5.82 0 0 0-5.55 4.03 5.76 5.76 0 0 0-3.84 2.8 5.82 5.82 0 0 0 .72 6.82 5.76 5.76 0 0 0 .49 4.73 5.82 5.82 0 0 0 6.27 2.8A5.76 5.76 0 0 0 12.8 24a5.82 5.82 0 0 0 5.55-4.04 5.76 5.76 0 0 0 3.84-2.79 5.82 5.82 0 0 0-.71-6.89zM12.8 22.4a4.32 4.32 0 0 1-2.77-1c.03-.02.09-.05.13-.08l4.6-2.66a.76.76 0 0 0 .38-.66v-6.5l1.95 1.12a.07.07 0 0 1 .04.05v5.38A4.34 4.34 0 0 1 12.8 22.4zm-9.33-3.97a4.32 4.32 0 0 1-.52-2.91c.03.02.09.06.13.08l4.6 2.66c.23.14.52.14.76 0l5.62-3.24v2.24a.07.07 0 0 1-.03.06L9.4 20.04a4.34 4.34 0 0 1-5.93-1.6zm-1.21-9.52a4.32 4.32 0 0 1 2.25-1.9v5.48a.75.75 0 0 0 .38.65l5.62 3.24-1.95 1.12a.07.07 0 0 1-.07 0L4.07 14.9A4.34 4.34 0 0 1 2.26 8.9zm16.04 3.73-5.62-3.24 1.95-1.12a.07.07 0 0 1 .07 0l4.43 2.56a4.34 4.34 0 0 1-.67 7.83v-5.48a.75.75 0 0 0-.16-.55zm1.94-2.93c-.03-.02-.09-.06-.13-.08l-4.6-2.65a.76.76 0 0 0-.76 0L9.13 10.2V7.96a.07.07 0 0 1 .03-.06l4.43-2.56a4.34 4.34 0 0 1 6.45 4.49l-.8.81zm-12.18 4-1.95-1.13a.07.07 0 0 1-.04-.05V7.14a4.34 4.34 0 0 1 7.12-3.33c-.03.02-.09.05-.13.07l-4.6 2.66a.76.76 0 0 0-.38.66l-.02 6.5zm1.06-2.28 2.5-1.44 2.5 1.44v2.88l-2.5 1.44-2.5-1.44V12.4z"/>
              </svg>
            </div>
            <div>
              <div className="brand-name">ChatGPT</div>
              <div className="brand-sub">OpenAI</div>
            </div>
            {chatgptConnected && <span className="connected-badge">Connected</span>}
          </div>

          {!chatgptConnected ? (
            <>
              <p className="card-desc">Route OpenAI requests through GHST AI using your API key.</p>
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
              <button className="btn-ghost" onClick={() => { setChatgptConnected(false); setChatgptKey(""); }}>Disconnect</button>
            </div>
          )}
        </div>

        {/* Claude */}
        <div className={`card ${claudeConnected ? "card-connected" : ""}`}>
          <div className="card-brand">
            <div className="brand-icon claude-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.3 2H6.7L2 12l4.7 10h10.6L24 12 17.3 2zM12 16.5c-2.5 0-4.5-2-4.5-4.5S9.5 7.5 12 7.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5z"/>
              </svg>
            </div>
            <div>
              <div className="brand-name">Claude</div>
              <div className="brand-sub">Anthropic</div>
            </div>
            {claudeConnected && <span className="connected-badge">Connected</span>}
          </div>

          {!claudeConnected ? (
            <>
              <p className="card-desc">Route Anthropic requests through GHST AI using your API key.</p>
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
              <button className="btn-ghost" onClick={() => { setClaudeConnected(false); setClaudeKey(""); }}>Disconnect</button>
            </div>
          )}
        </div>

        {/* Grok */}
        <div className={`card card-grok ${grokConnected ? "card-connected" : ""}`}>
          <div className="card-brand">
            <div className="brand-icon grok-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h7.5L21 21h-7.5L3 3zm0 18 6-9 3 4.5L9 21H3zm18-18-6 9-3-4.5L15 3h6z"/>
              </svg>
            </div>
            <div>
              <div className="brand-name">Grok</div>
              <div className="brand-sub">xAI</div>
            </div>
            {grokConnected && <span className="connected-badge">Connected</span>}
          </div>

          {!grokConnected ? (
            <>
              <p className="card-desc">Route xAI Grok requests through GHST AI using your API key.</p>
              <input
                className="key-input"
                type="password"
                placeholder="xai-..."
                value={grokKey}
                onChange={e => { setGrokKey(e.target.value); setGrokError(""); }}
                onKeyDown={e => e.key === "Enter" && connectGrok()}
              />
              {grokError && <p className="error-msg">{grokError}</p>}
              <button className="btn btn-grok" onClick={connectGrok}>Connect Grok</button>
              <a className="help-link" href="https://console.x.ai" target="_blank" rel="noreferrer">
                Get your API key →
              </a>
            </>
          ) : (
            <div className="connected-state">
              <div className="connected-icon">✓</div>
              <p>Grok is connected and routing through GHST AI.</p>
              <button className="btn-ghost" onClick={() => { setGrokConnected(false); setGrokKey(""); }}>Disconnect</button>
            </div>
          )}
        </div>

        {/* Gemini */}
        <div className={`card ${geminiConnected ? "card-connected" : ""}`}>
          <div className="card-brand">
            <div className="brand-icon gemini-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                <path d="M12 .5C5.65.5.5 5.65.5 12S5.65 23.5 12 23.5 23.5 18.35 23.5 12 18.35.5 12 .5zm0 4c.55 0 1 .45 1 1v5l4.33 2.5c.48.28.64.89.36 1.37-.28.48-.89.64-1.37.36L11 12.27V5.5c0-.55.45-1 1-1z"/>
              </svg>
            </div>
            <div>
              <div className="brand-name">Gemini</div>
              <div className="brand-sub">Google AI</div>
            </div>
            {geminiConnected && <span className="connected-badge">Connected</span>}
          </div>

          {!geminiConnected ? (
            <>
              <p className="card-desc">Route Google Gemini requests through GHST AI using your API key.</p>
              <input
                className="key-input"
                type="password"
                placeholder="AIza..."
                value={geminiKey}
                onChange={e => { setGeminiKey(e.target.value); setGeminiError(""); }}
                onKeyDown={e => e.key === "Enter" && connectGemini()}
              />
              {geminiError && <p className="error-msg">{geminiError}</p>}
              <button className="btn btn-gemini" onClick={connectGemini}>Connect Gemini</button>
              <a className="help-link" href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
                Get your API key →
              </a>
            </>
          ) : (
            <div className="connected-state">
              <div className="connected-icon">✓</div>
              <p>Gemini is connected and routing through GHST AI.</p>
              <button className="btn-ghost" onClick={() => { setGeminiConnected(false); setGeminiKey(""); }}>Disconnect</button>
            </div>
          )}
        </div>

      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #0A0C10;
          color: #E6E6E6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 24px 80px;
        }

        /* Status chip pinned top-right */
        .top-bar {
          width: 100%;
          max-width: 960px;
          display: flex;
          justify-content: flex-end;
          padding: 20px 0 0;
        }
        .status-chip {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          opacity: 0.5;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 20px;
          padding: 6px 14px;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }

        /* Hero */
        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 56px 0 56px;
        }
        .hero-logo {
          height: 160px;
          width: auto;
          object-fit: contain;
          filter: invert(1);
          margin-bottom: 28px;
        }
        .hero-sub {
          margin: 0;
          font-size: 15px;
          opacity: 0.4;
          max-width: 400px;
          line-height: 1.6;
        }

        /* Cards grid — 2x2 */
        .cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          width: 100%;
          max-width: 860px;
        }

        .card {
          background: #13161C;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 18px;
          padding: 26px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: border-color .2s, box-shadow .2s;
        }
        .card:hover {
          border-color: rgba(255,255,255,.12);
        }
        .card-connected {
          border-color: rgba(0,229,160,.22) !important;
          box-shadow: 0 0 0 1px rgba(0,229,160,.08) inset;
        }

        .card-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-icon {
          width: 42px;
          height: 42px;
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

        .brand-name { font-size: 16px; font-weight: 700; }
        .brand-sub  { font-size: 11px; opacity: 0.38; margin-top: 2px; text-transform: uppercase; letter-spacing: .5px; }

        .connected-badge {
          margin-left: auto;
          font-size: 10px;
          font-weight: 600;
          background: rgba(0,229,160,.12);
          color: #00E5A0;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: .4px;
        }

        .card-desc {
          margin: 0;
          font-size: 13px;
          opacity: 0.45;
          line-height: 1.55;
        }

        .key-input {
          width: 100%;
          background: #0A0C10;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 10px;
          padding: 11px 13px;
          font-size: 13px;
          color: #E6E6E6;
          font-family: monospace;
          outline: none;
          box-sizing: border-box;
          transition: border-color .15s;
        }
        .key-input:focus { border-color: rgba(255,255,255,.22); }
        .key-input::placeholder { opacity: 0.28; }

        .error-msg {
          margin: -4px 0 0;
          font-size: 12px;
          color: #FF4D4D;
        }

        .btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity .15s, transform .1s;
        }
        .btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn:active { transform: translateY(0); }
        .btn-openai  { background: #10A37F; color: #fff; }
        .btn-claude  { background: #D97559; color: #fff; }
        .btn-grok    { background: #8A63FF; color: #fff; }
        .btn-gemini  { background: #4285F4; color: #fff; }

        .help-link {
          font-size: 12px;
          color: inherit;
          opacity: 0.3;
          text-decoration: none;
          text-align: center;
        }
        .help-link:hover { opacity: 0.55; }

        .connected-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 12px 0;
          text-align: center;
        }
        .connected-icon {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: rgba(0,229,160,.12);
          color: #00E5A0;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .connected-state p { margin: 0; font-size: 13px; opacity: 0.5; }

        .btn-ghost {
          background: none;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 8px;
          padding: 7px 18px;
          color: #E6E6E6;
          font-size: 12px;
          cursor: pointer;
          opacity: 0.45;
          transition: opacity .15s;
        }
        .btn-ghost:hover { opacity: 0.75; }

        @media (max-width: 560px) {
          .cards { grid-template-columns: 1fr; }
          .hero-logo { height: 110px; }
        }
      `}</style>
    </div>
  );
}
