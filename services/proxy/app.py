from fastapi import FastAPI, Request
from datetime import datetime, timezone
from collections import deque
import time

app = FastAPI(title="GHST AI Proxy")

# In-memory request log (newest first, max 200 entries)
request_log: deque = deque(maxlen=200)
_stats = {"total": 0, "errors": 0, "total_latency_ms": 0.0}

# Endpoints that should not be logged
_SKIP_PATHS = {"/", "/api/status", "/api/metrics", "/api/logs"}


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.monotonic()
    response = await call_next(request)
    latency_ms = round((time.monotonic() - start) * 1000, 1)

    if request.url.path not in _SKIP_PATHS:
        entry = {
            "time": datetime.now(timezone.utc).isoformat(),
            "method": request.method,
            "path": request.url.path,
            "status": response.status_code,
            "latency_ms": latency_ms,
        }
        request_log.appendleft(entry)
        _stats["total"] += 1
        if response.status_code >= 400:
            _stats["errors"] += 1
        _stats["total_latency_ms"] += latency_ms

    return response


@app.get("/")
def root():
    return {"status": "healthy", "service": "proxy", "hint": "use /api/status"}


@app.get("/api/status")
def status():
    return {"status": "healthy", "service": "proxy"}


@app.get("/api/metrics")
def metrics():
    total = _stats["total"]
    success_rate = (
        round((total - _stats["errors"]) / total * 100, 1) if total > 0 else 100.0
    )
    avg_latency = (
        round(_stats["total_latency_ms"] / total, 1) if total > 0 else 0.0
    )
    return {
        "total_requests": total,
        "success_rate": success_rate,
        "avg_latency_ms": avg_latency,
        "errors": _stats["errors"],
    }


@app.get("/api/logs")
def logs(limit: int = 50):
    return {"logs": list(request_log)[:limit]}
