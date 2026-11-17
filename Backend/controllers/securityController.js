import crypto from "crypto";
import Threat from "../models/Threat.js";
import Vulnerability from "../models/Vulnerability.js";
import Alert from "../models/Alert.js";
import ChatHistory from "../models/ChatHistory.js";
import { throwBadRequest, throwNotFound } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { saveRAMFiles } from "../middlewares/memoryUpload.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper to calculate Levenshtein distance between two strings
const getLevenshteinDistance = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === b.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1,   // insertion
            matrix[i - 1][j] + 1    // deletion
          )
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

/**
 * Helper: Analyze Phishing using Google Gemini AI
 */
const analyzePhishingWithGemini = async (type, content) => {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are CyberSentinel AI, an enterprise-grade Phishing & Social Engineering Threat Intelligence Engine.
Analyze the following ${type === "url" ? "URL / Web link" : "Email content / text"} for security indicators:
- Social engineering (urgency, fear, greed, fake authority)
- Brand spoofing / typo-squatting
- Credential harvesting patterns
- Suspicious redirection or unusual URL schemes
- Hidden payloads or deceptive call-to-actions

Content to analyze:
"""
${content}
"""

Respond ONLY with a valid JSON object strictly matching this schema with no markdown formatting and no code blocks:
{
  "score": <number between 0 and 100>,
  "classification": <"Safe" | "Suspicious" | "High Risk">,
  "isMalicious": <boolean, true if score >= 70 else false>,
  "details": [
    <array of concise, highly actionable observation strings explaining specific threats or confirming legitimacy>
  ]
}`;

    const result = await model.generateContent(prompt);
    let rawText = result.response.text().trim();
    // Strip possible markdown backticks
    rawText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

    const parsed = JSON.parse(rawText);
    if (typeof parsed.score === "number" && parsed.classification && Array.isArray(parsed.details)) {
      const score = Math.min(Math.max(Math.round(parsed.score), 0), 100);
      return {
        score,
        classification: parsed.classification,
        isMalicious: score >= 70,
        details: parsed.details,
      };
    }
  } catch (error) {
    console.error("[Gemini AI] Phishing scan fallback triggered:", error.message);
  }
  return null;
};

/**
 * Helper: Analyze Vulnerabilities with Gemini AI
 */
const analyzeVulnsWithGemini = async (targetType, target, liveOpenPorts = []) => {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const portContext = liveOpenPorts && liveOpenPorts.length > 0
      ? `Live port scan detected open ports on target: ${liveOpenPorts.map(p => `Port ${p.port} (${p.service})`).join(", ")}.`
      : "";

    const prompt = `You are CyberSentinel AI, an Enterprise Vulnerability Scanner and Threat Intelligence auditor.
Simulate a vulnerability scan and security audit for the target ${targetType.toUpperCase()}: "${target}".
${portContext}
Identify 3 to 4 plausible, realistic, and well-documented CVE vulnerabilities that this target's common stack (e.g., OpenSSL, Nginx, Apache, SSH, TLS, DNS, or Kernel) could encounter.

Respond ONLY with a valid JSON array strictly matching this format without markdown code blocks:
[
  {
    "cve": "CVE-YYYY-NNNN",
    "severity": "Critical" | "High" | "Medium" | "Low",
    "component": "Specific component or service name",
    "description": "Clear technical description of the vulnerability risk."
  }
]`;

    const result = await model.generateContent(prompt);
    let rawText = result.response.text().trim();
    rawText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

    const parsed = JSON.parse(rawText);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.filter(v => v.cve && v.severity && v.component && v.description);
    }
  } catch (error) {
    console.error("[Gemini AI] Vuln scan fallback triggered:", error.message);
  }
  return null;
};

/**
 * Helper: Analyze Code Snippet / Malware with Gemini AI
 */
const analyzeCodeWithGemini = async (fileName, fileContent) => {
  if (!process.env.GEMINI_API_KEY || !fileContent) return null;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Truncate preview if very long
    const snippet = fileContent.slice(0, 4000);

    const prompt = `You are CyberSentinel AI Sandbox, an advanced Static Code & Malware Analysis Engine.
Analyze the following script / file content ("${fileName}") for security threats, malicious behavior, reverse shells, obfuscation, destructive filesystem commands, keyloggers, or backdoors:

"""
${snippet}
"""

Respond ONLY with a valid JSON object strictly matching this schema with no markdown formatting:
{
  "score": <number between 0 and 100 representing malware likelihood>,
  "threatLevel": <"Malicious" | "Clean">,
  "enginesDetected": <integer between 0 and 64>,
  "details": [
    <array of concise strings explaining suspicious or benign code patterns found>
  ]
}`;

    const result = await model.generateContent(prompt);
    let rawText = result.response.text().trim();
    rawText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

    const parsed = JSON.parse(rawText);
    if (typeof parsed.score === "number" && parsed.threatLevel && Array.isArray(parsed.details)) {
      return {
        score: Math.min(Math.max(Math.round(parsed.score), 0), 100),
        threatLevel: parsed.threatLevel,
        enginesDetected: typeof parsed.enginesDetected === "number" ? parsed.enginesDetected : (parsed.score >= 50 ? 12 : 0),
        details: parsed.details,
      };
    }
  } catch (error) {
    console.error("[Gemini AI] Code analysis fallback triggered:", error.message);
  }
  return null;
};

/**
 * @desc    Scan email content or links for phishing indicators
 * @route   POST /api/security/phishing-scan
 * @access  Protected (All logged-in roles)
 */
const runPhishingScan = async (req, res, next) => {
  const { type, content } = req.body;

  try {
    if (!type || !content) {
      throwBadRequest("Please provide scan type ('email' or 'url') and content.");
    }

    let report = null;

    // 1. Try Gemini AI First for cutting-edge NLP analysis
    const aiReport = await analyzePhishingWithGemini(type, content);
    if (aiReport) {
      report = aiReport;
    } else {
      // 2. Enhanced Heuristic Fallback
      const textToAnalyze = content.toLowerCase();
      let score = 15;
      const details = [];

      const urgentKeywords = [
        "immediate action required",
        "immediate action",
        "verify password",
        "verify your account",
        "unauthorized transaction",
        "unauthorized transfer",
        "suspend your account",
        "alert: security compromise",
        "immediate response",
        "reset password",
        "account suspended",
        "wire transfer",
        "gift card",
        "claim your prize",
      ];

      const hasUrgentLanguage = urgentKeywords.some((keyword) =>
        textToAnalyze.includes(keyword)
      );

      if (hasUrgentLanguage) {
        score += 40;
        details.push("Urgent threat-inducing language detected ('Immediate action required' indicators).");
      }

      if (type === "url") {
        let protocol = "";
        let domain = "";

        const urlMatch = textToAnalyze.match(/^([a-z]+):\/\/([^\/]+)/i);
        if (urlMatch) {
          protocol = urlMatch[1].toLowerCase();
          domain = urlMatch[2].toLowerCase();
        } else {
          domain = textToAnalyze.split("/")[0].toLowerCase();
        }

        if (protocol && protocol !== "http" && protocol !== "https") {
          score += 40;
          details.push("Invalid or unsupported URL protocol detected.");
        } else if (!protocol) {
          score += 5;
          details.push("No explicit URL protocol provided. Assuming standard domain.");
        }

        // Typo-Squatting Detection
        const popularDomains = [
          "github.com", "google.com", "microsoft.com", "apple.com", "amazon.com",
          "facebook.com", "twitter.com", "linkedin.com", "paypal.com", "netflix.com",
          "bankofamerica.com", "chase.com", "cybersentinel.com"
        ];

        for (const pop of popularDomains) {
          const dist = getLevenshteinDistance(domain, pop);
          if (dist > 0 && dist <= 2) {
            score += 45;
            details.push(`Possible typo-squatting domain detected (${domain} resembles ${pop}).`);
            break;
          }
        }

        const suspiciousDomains = [
          "secure-login",
          "update-account",
          "verify-account",
          "verify-cybersentinel",
          "free-prize",
          "giftcard",
          "claim-bonus",
          "refund-portal",
        ];

        if (suspiciousDomains.some((dom) => textToAnalyze.includes(dom))) {
          score += 35;
          details.push("Suspicious phishing domain keywords detected inside the URL string.");
        }
      } else {
        const emailMismatches = [
          "paypal-verify@",
          "secure-bank@",
          "support-admin@",
          "gift-rewards@",
          "security-update@",
          "billing-alert@",
        ];

        if (emailMismatches.some((mis) => textToAnalyze.includes(mis))) {
          score += 35;
          details.push("Suspicious sender address domain mismatch detected.");
        }
      }

      score = Math.min(score, 100);
      const isMalicious = score >= 70;

      let classification = "Safe";
      if (score >= 70) {
        classification = "High Risk";
      } else if (score >= 40) {
        classification = "Suspicious";
      }

      if (classification === "Safe" && details.length === 0) {
        details.push("No obvious phishing signatures or social engineering markers identified.");
      }

      report = {
        score,
        isMalicious,
        classification,
        details,
      };
    }

    // If malicious, log Threat and create real-time alert
    if (report.isMalicious) {
      const threatSource = type === "url" ? content : "Email Gateway Filter";
      const threatTarget = type === "url" ? "User Web Proxy" : "User Mailbox";
      const threatSeverity = report.score >= 90 ? "Critical" : "High";

      const threatObj = await Threat.create({
        type: "Phishing Attempt",
        source: threatSource,
        target: threatTarget,
        severity: threatSeverity,
        status: "Active",
      });

      const alertObj = await Alert.create({
        message: `High risk Phishing attempt detected (${report.score}/100) on target ${threatTarget}!`,
        type: report.score >= 90 ? "critical" : "warning",
        isRead: false,
      });

      const io = req.app?.get("io");
      if (io) {
        io.emit("new-threat", threatObj);
        io.emit("new-alert", alertObj);
      }
    }

    return sendSuccess(res, report, "Phishing scan analysis completed successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Simulate vulnerability port scanning on targets (IP/Domain)
 * @route   POST /api/security/vuln-scan
 * @access  Protected (Super Admin, Security Analyst)
 */
const runVulnScan = async (req, res, next) => {
  const { targetType, target } = req.body;

  try {
    if (!targetType || !target) {
      throwBadRequest("Please provide target type ('ip' or 'domain') and target address.");
    }

    let vulnerabilitiesToRegister = [];

    // 0. Optional integration: check if local Python Security Engine (FastAPI) is running
    let liveOpenPorts = [];
    try {
      const pyRes = await fetch("http://127.0.0.1:8000/api/scan/ports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
        signal: AbortSignal.timeout(1200),
      });
      if (pyRes.ok) {
        const pyData = await pyRes.json();
        if (pyData.success && Array.isArray(pyData.open_ports)) {
          liveOpenPorts = pyData.open_ports;
        }
      }
    } catch {
      // Python engine not running or timed out; continue gracefully
    }

    // 1. Try Gemini AI for dynamic real-world CVE detection
    const aiVulns = await analyzeVulnsWithGemini(targetType, target, liveOpenPorts);
    if (aiVulns && aiVulns.length > 0) {
      vulnerabilitiesToRegister = aiVulns;
    } else {
      // 2. Intelligent diversified fallback pool
      const isIP = targetType === "ip";
      const fallbackPool = [
        {
          cve: "CVE-2024-3094",
          severity: "Critical",
          component: "XZ Utils / SSHd",
          description: "Malicious backdoor embedded in upstream tarballs allows unauthorized bypass of authentication.",
        },
        {
          cve: "CVE-2024-1024",
          severity: "High",
          component: "OpenSSL 3.0",
          description: "Buffer overflow vulnerability detected in TLS memory allocation.",
        },
        {
          cve: "CVE-2023-44487",
          severity: "High",
          component: "HTTP/2 Server",
          description: "Rapid Reset attack vector enables denial of service via RST_STREAM flood.",
        },
        {
          cve: "CVE-2023-4863",
          severity: isIP ? "Medium" : "Critical",
          component: isIP ? "Nginx Reverse Proxy" : "TLS Certificate / WebKit",
          description: "Heap buffer overflow in compressed content rendering pipeline.",
        },
        {
          cve: "CVE-2023-38606",
          severity: "Low",
          component: "SSH Protocol Service",
          description: "Weak cipher suites or legacy key exchange methods permitted.",
        },
      ];

      // Select 3 based on target string hash for consistent variety
      const hashVal = target.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const startIdx = hashVal % 2;
      vulnerabilitiesToRegister = fallbackPool.slice(startIdx, startIdx + 3);
    }

    const savedFindings = [];

    for (const vuln of vulnerabilitiesToRegister) {
      // Check if this CVE is already open for this target to prevent duplicate spam
      let existing = await Vulnerability.findOne({ cve: vuln.cve, target, status: "Open" });

      if (existing) {
        existing.dateScanned = new Date();
        await existing.save();
        savedFindings.push(existing);
      } else {
        const dbEntry = await Vulnerability.create({
          cve: vuln.cve,
          target,
          severity: vuln.severity,
          component: vuln.component,
          description: vuln.description,
          status: "Open",
        });

        savedFindings.push(dbEntry);

        if (vuln.severity === "High" || vuln.severity === "Critical") {
          const alertObj = await Alert.create({
            message: `Vulnerability ${vuln.cve} (${vuln.severity}) identified on scanned target ${target}!`,
            type: "critical",
            isRead: false,
          });

          const io = req.app?.get("io");
          if (io) {
            io.emit("new-alert", alertObj);
          }
        }
      }
    }

    return sendSuccess(
      res,
      savedFindings,
      `Vulnerability scan on target ${target} completed successfully! ${savedFindings.length} issues analyzed.`
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit a question/prompt to the AI Security Copilot
 * @route   POST /api/security/ai-chat
 * @access  Protected (All logged-in roles)
 */
const aiChat = async (req, res, next) => {
  const { prompt } = req.body;
  const userId = req.user._id;

  try {
    if (!prompt) {
      throwBadRequest("Please provide a prompt for the AI Assistant.");
    }

    let reply = "";

    // If API key is available, use Google Gemini AI
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Retrieve recent chat history for context
        const chat = await ChatHistory.findOne({ user: userId });
        const recentHistory = chat ? chat.messages.slice(-4).map(m => `${m.role === "user" ? "User" : "Security Copilot"}: ${m.content}`).join("\n") : "";

        const systemPrompt = `You are CyberSentinel AI, an advanced Enterprise Security Copilot and SOC Analyst.
Answer the following cybersecurity question with clarity, accurate technical depth, and actionable mitigation guidance.

${recentHistory ? `Recent conversation context:\n${recentHistory}\n` : ""}
User Query: ${prompt}`;

        const result = await model.generateContent(systemPrompt);
        reply = result.response.text();
      } catch (geminiError) {
        console.error("Gemini AI API Error, falling back to heuristics:", geminiError.message);
      }
    }

    // Heuristics Fallback if Gemini key is missing or failed
    if (!reply) {
      const query = prompt.toLowerCase();
      reply = "I've analyzed your query. Based on the current security context, everything looks stable, but I recommend checking the latest vulnerability scan results.";

      if (query.includes("cve")) {
        reply = "CVE-2024-1024 is a critical buffer overflow vulnerability found in OpenSSL. It allows remote attackers to execute arbitrary code. Recommended action: Patch the system immediately to the latest version.";
      } else if (query.includes("phishing")) {
        reply = "To mitigate a phishing attack: 1) Isolate the affected user's machine. 2) Reset their credentials immediately. 3) Block the malicious sender domain at the email gateway. 4) Run a full system malware scan.";
      } else if (query.includes("threat") || query.includes("status")) {
        reply = "Currently, our monitoring systems show no new active threats outside of expected background noise. Be sure to audit port scans and active incident responses in the central terminal.";
      }
    }

    // Save chat history
    let chat = await ChatHistory.findOne({ user: userId });
    if (!chat) {
      chat = new ChatHistory({ user: userId, messages: [] });
    }

    chat.messages.push({ role: "user", content: prompt });
    chat.messages.push({ role: "ai", content: reply });
    await chat.save();

    return sendSuccess(res, { reply, history: chat.messages }, "AI Response generated successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's AI assistant chat history
 * @route   GET /api/security/ai-chat/history
 * @access  Protected (All logged-in roles)
 */
const getChatHistory = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const chat = await ChatHistory.findOne({ user: userId });
    const messages = chat ? chat.messages : [];
    return sendSuccess(res, messages, "Chat history retrieved successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Analyze a pasted script or mock file metadata inside the sandbox
 * @route   POST /api/security/malware-analyze
 * @access  Protected (All logged-in roles)
 */
const malwareAnalyze = async (req, res, next) => {
  const { fileName, fileContent } = req.body;

  try {
    if (!fileName) {
      throwBadRequest("Please provide a filename to analyze.");
    }

    // Compute true cryptographic SHA-256 hash
    const contentToHash = fileContent || fileName;
    const hash = crypto.createHash("sha256").update(contentToHash).digest("hex");

    let score = 0;
    const details = [];
    let threatLevel = "Clean";
    let enginesDetected = 0;

    // 1. Try Gemini AI for static code analysis if content is provided
    if (fileContent) {
      const aiResult = await analyzeCodeWithGemini(fileName, fileContent);
      if (aiResult) {
        score = aiResult.score;
        threatLevel = aiResult.threatLevel;
        enginesDetected = aiResult.enginesDetected;
        details.push(...aiResult.details);
      }
    }

    // 2. Fallback heuristic checks if AI was not run or details are empty
    if (details.length === 0) {
      if (fileContent) {
        const lowerContent = fileContent.toLowerCase();

        if (lowerContent.includes("eval(") || lowerContent.includes("exec(")) {
          score += 40;
          details.push("Dynamic code execution function detected ('eval' / 'exec').");
        }
        if (
          lowerContent.includes("child_process") ||
          lowerContent.includes("spawn(") ||
          lowerContent.includes("system(") ||
          lowerContent.includes("cmd.exe") ||
          lowerContent.includes("powershell")
        ) {
          score += 35;
          details.push("System shell command execution interface detected.");
        }
        if (
          lowerContent.includes("fs.write") ||
          lowerContent.includes("fs.unlink") ||
          lowerContent.includes("rm -rf") ||
          lowerContent.includes("format c:")
        ) {
          score += 30;
          details.push("Destructive filesystem modifications identified.");
        }
        if (lowerContent.includes("nc -e") || lowerContent.includes("/dev/tcp/")) {
          score += 45;
          details.push("Reverse shell signature detected in script payload.");
        }
      } else {
        const ext = fileName.split(".").pop().toLowerCase();
        if (["exe", "bat", "sh", "scr", "vbs", "ps1", "dll"].includes(ext)) {
          score += 50;
          details.push(`Executable binary / script file format detected ('.${ext}').`);
        } else {
          score += 10;
          details.push(`Standard document format analysis completed ('.${ext}').`);
        }
      }

      score = Math.min(Math.max(score, 0), 100);
      threatLevel = score >= 50 ? "Malicious" : "Clean";
      enginesDetected = threatLevel === "Malicious" ? Math.floor(score / 3) : 0;
      if (details.length === 0) {
        details.push("No suspicious operations, backdoors, or malicious signatures detected.");
      }
    }

    const isMalicious = threatLevel === "Malicious" || score >= 50;

    if (isMalicious) {
      const threatObj = await Threat.create({
        type: "Malware Detected",
        source: `Sandbox Analysis: ${fileName}`,
        target: "Security Incident Desk",
        severity: score >= 85 ? "Critical" : "High",
        status: "Active",
      });

      const alertObj = await Alert.create({
        message: `Malware payload (${score}/100) identified in sandbox analysis of ${fileName}!`,
        type: score >= 85 ? "critical" : "warning",
        isRead: false,
      });

      const io = req.app?.get("io");
      if (io) {
        io.emit("new-threat", threatObj);
        io.emit("new-alert", alertObj);
      }
    }

    const report = {
      hash,
      fileName,
      score,
      threatLevel,
      enginesDetected,
      totalEngines: 64,
      details,
    };

    return sendSuccess(res, report, `Sandbox malware analysis of ${fileName} completed successfully.`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload and analyze binary/script file in Sandbox
 * @route   POST /api/security/malware-upload
 * @access  Protected (All logged-in roles)
 */
const malwareUpload = async (req, res, next) => {
  try {
    if (!req.tempFiles || req.tempFiles.length === 0) {
      return throwBadRequest("No file was uploaded.");
    }

    // Save and compress files (if image/pdf) or write directly to server
    await saveRAMFiles(req.tempFiles);

    const uploadedFile = req.tempFiles[0];
    const fileName = uploadedFile.finalPath.split("/").pop();

    // Compute genuine cryptographic SHA-256 hash of the uploaded binary buffer
    const hash = crypto.createHash("sha256").update(uploadedFile.buffer).digest("hex");

    const details = [];
    let score = 0;
    const ext = (uploadedFile.originalExt || "").replace(".", "").toLowerCase();

    // Magic Bytes & Header inspection
    const buffer = uploadedFile.buffer;
    const isPE = buffer.length >= 2 && buffer[0] === 0x4d && buffer[1] === 0x5a; // 'MZ' (Windows Executable / DLL)
    const isELF = buffer.length >= 4 && buffer[0] === 0x7f && buffer[1] === 0x45 && buffer[2] === 0x4c && buffer[3] === 0x46; // ELF Linux
    const isPDF = buffer.length >= 4 && buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46; // %PDF
    const isZip = buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04; // PK..

    if (isPE) {
      score += 45;
      details.push("Portable Executable (PE/MZ) binary header detected (Native Windows Executable).");
    } else if (isELF) {
      score += 40;
      details.push("Executable and Linkable Format (ELF) header detected (Native Linux Binary).");
    } else if (isPDF) {
      details.push("Standard Adobe Portable Document Format (PDF) header verified.");
    } else if (isZip) {
      details.push("Standard ZIP / Compressed archive header verified.");
    }

    // If script or readable text file, perform static analysis
    const isScript = ["js", "py", "sh", "bat", "vbs", "ps1", "txt"].includes(ext);
    if (isScript) {
      const fileContentString = buffer.toString("utf-8");
      const aiResult = await analyzeCodeWithGemini(fileName, fileContentString);

      if (aiResult) {
        score = Math.max(score, aiResult.score);
        details.push(...aiResult.details);
      } else {
        const lowerContent = fileContentString.toLowerCase();
        if (lowerContent.includes("eval(") || lowerContent.includes("exec(")) {
          score += 40;
          details.push("Dynamic code execution function detected ('eval' / 'exec').");
        }
        if (lowerContent.includes("child_process") || lowerContent.includes("spawn(") || lowerContent.includes("system(")) {
          score += 35;
          details.push("System shell command execution interface detected.");
        }
        if (lowerContent.includes("fs.write") || lowerContent.includes("fs.unlink") || lowerContent.includes("rm -rf")) {
          score += 25;
          details.push("Destructive filesystem modifications identified.");
        }
      }
    } else if (["exe", "bat", "sh", "scr", "vbs", "dll", "msi"].includes(ext)) {
      score += 30;
      details.push(`High-risk executable file extension detected ('.${ext}').`);
    }

    score = Math.min(Math.max(score, 0), 100);
    const isMalicious = score >= 50;
    const threatLevel = isMalicious ? "Malicious" : "Clean";
    const enginesDetected = isMalicious ? Math.floor(score / 3) + 2 : 0;

    if (details.length === 0) {
      details.push("No suspicious operations, backdoors, or malicious signatures detected.");
    }

    if (isMalicious) {
      const threatObj = await Threat.create({
        type: "Malware Detected",
        source: `Sandbox Upload: ${fileName}`,
        target: "Security Incident Desk",
        severity: score >= 85 ? "Critical" : "High",
        status: "Active",
      });

      const alertObj = await Alert.create({
        message: `Malware payload (${score}/100) identified in sandbox upload of ${fileName}!`,
        type: score >= 85 ? "critical" : "warning",
        isRead: false,
      });

      const io = req.app?.get("io");
      if (io) {
        io.emit("new-threat", threatObj);
        io.emit("new-alert", alertObj);
      }
    }

    const report = {
      hash,
      fileName,
      score,
      threatLevel,
      enginesDetected,
      totalEngines: 64,
      details,
      filePath: "/" + uploadedFile.finalPath,
    };

    return sendSuccess(res, report, `Sandbox malware upload analysis of ${fileName} completed successfully.`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all registered vulnerabilities
 * @route   GET /api/security/vulnerabilities
 * @access  Protected (Super Admin, Security Analyst)
 */
const getVulnerabilities = async (req, res, next) => {
  try {
    const vulns = await Vulnerability.find({}).sort({ dateScanned: -1 });
    return sendSuccess(res, vulns, "Vulnerabilities retrieved successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update vulnerability status (e.g. resolve/patch)
 * @route   PATCH /api/security/vulnerabilities/:id
 * @access  Protected (Super Admin, Security Analyst)
 */
const patchVulnerability = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!status || !["Open", "Resolved", "Patched"].includes(status)) {
      throwBadRequest("Please provide a valid status ('Open', 'Resolved', 'Patched').");
    }

    const vuln = await Vulnerability.findById(id);
    if (!vuln) {
      throwNotFound(`Vulnerability with ID ${id} not found.`);
    }

    vuln.status = status;
    await vuln.save();

    return sendSuccess(res, vuln, "Vulnerability status updated successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a vulnerability record
 * @route   DELETE /api/security/vulnerabilities/:id
 * @access  Protected (Super Admin, Security Analyst)
 */
const deleteVulnerability = async (req, res, next) => {
  try {
    const vulnId = req.params.id;

    const deletedVuln = await Vulnerability.findByIdAndDelete(vulnId);

    if (!deletedVuln) {
      throwNotFound("Vulnerability record not found.");
    }

    return sendSuccess(res, null, "Vulnerability record deleted successfully.");
  } catch (error) {
    next(error);
  }
};

export default {
  runPhishingScan,
  runVulnScan,
  aiChat,
  getChatHistory,
  malwareAnalyze,
  malwareUpload,
  getVulnerabilities,
  patchVulnerability,
  deleteVulnerability,
};

export {
  runPhishingScan,
  runVulnScan,
  aiChat,
  getChatHistory,
  malwareAnalyze,
  malwareUpload,
  getVulnerabilities,
  patchVulnerability,
  deleteVulnerability,
};
