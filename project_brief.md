# 🛡️ CyberSentinel AI

## 📌 Project Overview
CyberSentinel AI is a next-generation, AI-powered Enterprise Security Platform designed to proactively hunt, monitor, and mitigate cyber threats before they breach a network perimeter. Built with the MERN stack, powered by Google's Gemini AI, and optionally augmented with a Python Security Engine, it provides a comprehensive dashboard for real-time threat monitoring and incident response.

## 🎯 Problem Statement
Modern enterprises face sophisticated cyber threats such as zero-day malware, AI-generated phishing attacks, and complex social engineering tactics. Traditional security systems often rely on static rules, lacking the dynamic intelligence needed to detect anomalies in real-time or provide immediate, actionable mitigation strategies.

## 💡 Solution
CyberSentinel AI solves this by integrating advanced heuristic analysis, Google's Gemini AI, and specialized Python security tools to create a proactive defense mechanism. It features a Malware Sandbox for analyzing suspicious files, an AI-driven Phishing Detection tool for scanning emails/URLs, and a centralized alerting system that notifies security analysts of breaches in real-time via WebSockets. 

## 🌟 Key Features
- **🧠 AI Security Copilot:** Leverages Google Gemini 2.0 Flash to analyze threats, answer security queries, and instantly provide context-aware mitigation strategies.
- **🦠 Malware Sandbox:** Computes true cryptographic SHA-256 hashes, inspects PE/ELF/PDF/ZIP magic bytes, and performs static code/binary heuristic analysis.
- **🎣 Phishing & URL Detection:** Uses Natural Language Processing (NLP) via Gemini AI combined with typo-squatting algorithms (Levenshtein distance) to scan emails and links.
- **🔍 Vulnerability Scanner:** AI-powered CVE intelligence and penetration testing simulator, with optional live port scanning via the Python microservice.
- **🐍 Python Security Engine (Microservice):** Dedicated FastAPI service for multi-threaded TCP port scanning, Shannon entropy calculation, and raw packet inspection.
- **🚨 Real-Time Alerts:** Live threat monitoring dashboards powered by WebSockets (Socket.io) for instant notifications.
- **👥 Role-Based Access Control (RBAC):** Distinct capabilities for Super Admins, Security Analysts, and standard Employees to enforce the principle of least privilege.

## 🛠️ Tech Stack
- **Frontend:** React.js (Vite), Tailwind CSS, Framer Motion, Lucide Icons
- **Backend:** Node.js, Express.js, Socket.io
- **Security Microservice:** Python 3.12, FastAPI, Uvicorn (Port 8000)
- **Database:** MongoDB (Mongoose ORM)
- **AI Integration:** Google Gemini API (`gemini-2.0-flash`)
- **Security & Hashing:** Node.js `crypto` (SHA-256), JWT Authentication, Bcrypt.js, Helmet, Rate Limiting
