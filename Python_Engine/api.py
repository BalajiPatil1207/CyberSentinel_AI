"""
CyberSentinel AI - Python FastAPI Microservice
Author: Balaji Patil
GitHub: github.com/BalajiPatil1207

Run with:
uvicorn api:app --host 127.0.0.1 --port 8000 --reload
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import engine

app = FastAPI(
    title="CyberSentinel AI Python Security Engine",
    description="Microservice providing real-time port scanning, Shannon entropy malware inspection, and network security audit tools.",
    version="1.0.0"
)

# Enable CORS for Node.js backend and React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PortScanRequest(BaseModel):
    target: str
    ports: Optional[List[int]] = None


class URLScanRequest(BaseModel):
    url: str


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "CyberSentinel AI Python Security Engine",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    return {"status": "ok", "engine": "ready"}


@app.post("/api/scan/ports")
def scan_ports(req: PortScanRequest):
    if not req.target:
        raise HTTPException(status_code=400, detail="Target IP or hostname required")

    open_ports = engine.scan_target_ports(req.target, req.ports)
    return {
        "success": True,
        "target": req.target,
        "open_ports_count": len(open_ports),
        "open_ports": open_ports,
    }


@app.post("/api/scan/url")
def scan_url(req: URLScanRequest):
    if not req.url:
        raise HTTPException(status_code=400, detail="URL is required")

    analysis = engine.inspect_url(req.url)
    return {
        "success": True,
        "analysis": analysis
    }


@app.post("/api/scan/file")
async def scan_file(file: UploadFile = File(...)):
    contents = await file.read()
    report = engine.inspect_file_data(file.filename, contents)
    return {
        "success": True,
        "report": report
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
