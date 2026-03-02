import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    const origin = window.location.origin;

    const proxyUrl = origin.includes("-8080.")
      ? origin.replace("-8080.", "-5000.")
      : "http://localhost:5000";

    fetch(`${proxyUrl}/api/status`)
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus("offline"));
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>GHST AI</h1>
      <h2>Proxy Status: {status}</h2>
    </div>
  );
}