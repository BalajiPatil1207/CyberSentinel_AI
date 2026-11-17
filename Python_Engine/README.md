# 🐍 CyberSentinel AI - Python Security Engine

## 📌 Overview
The **Python Security Engine** is a high-performance microservice that augments the CyberSentinel AI MERN Stack platform. It provides dedicated cybersecurity tools that are traditionally executed in Python:

1. **Multi-Threaded TCP Port Scanner**: Discovers open network ports, services, and banners on target IPs.
2. **Shannon Entropy Analysis**: Computes the entropy (randomness) of uploaded binary files to detect packers, obfuscation, and ransomware encryption signatures.
3. **PE / ELF / Archive Header Inspection**: Detects Windows PE (MZ) and Linux ELF binaries directly from raw byte headers.
4. **URL & Domain Intelligence**: Validates DNS resolution, hostname structure, and network routability.

---

## 🛠️ Tech Stack
- **Framework**: FastAPI (Asynchronous Python Web Framework)
- **ASGI Server**: Uvicorn
- **Validation**: Pydantic
- **Standard Libraries**: `socket`, `ssl`, `hashlib`, `math`, `urllib.parse`

---

## 🚀 How to Run the Python Engine

### Option 1: One-Click Launch (Windows)
Double-click `start_engine.bat` inside this folder. It will install requirements and start the server automatically.

### Option 2: Command Line
```bash
# 1. Navigate to the Python Engine directory
cd Python_Engine

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the microservice
uvicorn api:app --host 127.0.0.1 --port 8000 --reload
```

The server will start on: **`http://127.0.0.1:8000`**  
Interactive Swagger API documentation: **`http://127.0.0.1:8000/docs`**

---

## 🔌 API Endpoints
- `GET /health` - Health check endpoint
- `POST /api/scan/ports` - Scans open TCP ports for a given IP or domain
- `POST /api/scan/url` - Analyzes URL structure and resolves DNS
- `POST /api/scan/file` - Multipart file upload returning SHA-256, MD5, and Shannon Entropy

---

## 🏗️ Architecture Synergy
The Node.js backend seamlessly connects to this Python microservice when active, while maintaining intelligent Google Gemini AI heuristics if the microservice is offline.
