from fastapi import FastAPI

app = FastAPI(title="GHST AI Proxy")

@app.get("/")
def root():
    return {"status": "healthy", "service": "proxy", "hint": "use /api/status"}

@app.get("/api/status")
def status():
    return {"status": "healthy", "service": "proxy"}
