from fastapi import FastAPI
from fastapi.responses import RedirectResponse

app = FastAPI(title="GHST AI Proxy")


@app.get("/")
def root():
    return {"status": "healthy", "service": "proxy", "hint": "use /api/status"}


@app.get("/api/status")
def status():
    return {
        "status": "healthy",
        "service": "proxy",
        "services": {
            "dashboard": "http://dashboard:8080",
            "vinscout": "http://vinscout:8501",
        }
    }


@app.get("/vinscout")
def vinscout_redirect():
    """Quick-access redirect to VINScout dashboard."""
    return RedirectResponse(url="http://localhost:8501")
