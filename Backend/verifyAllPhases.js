import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { register, login, getUsers, updateUserStatus } from "./controllers/authController.js";
import { aiChat, getChatHistory, malwareAnalyze, malwareUpload, getVulnerabilities, patchVulnerability } from "./controllers/securityController.js";
import User from "./models/User.js";
import ChatHistory from "./models/ChatHistory.js";
import Threat from "./models/Threat.js";
import Vulnerability from "./models/Vulnerability.js";
import Alert from "./models/Alert.js";

async function runTests() {
  console.log("Starting All-Phases Verification Tests with MongoMemoryServer...\n");
  
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await mongoose.connect(uri);
  console.log("Connected to in-memory MongoDB:", uri);

  // Helper helper to create mock express res
  const createMockRes = () => {
    const res = {};
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.body = data;
      return res;
    };
    return res;
  };

  const mockNext = (err) => {
    if (err) {
      console.error("  Next called with error:", err);
      throw err;
    }
  };

  try {
    // ----------------------------------------------------
    // TEST 1: Register and Login User
    // ----------------------------------------------------
    console.log("\n[TEST 1] Registering and Authenticating User...");
    const req1 = {
      body: {
        name: "Test Analyst",
        email: "analyst@patilcybershield.com",
        password: "securePassword123",
        role: "Security Analyst"
      }
    };
    const res1 = createMockRes();
    await register(req1, res1, mockNext);
    console.log("  Register Response:", res1.body.message);

    const loginReq = {
      body: {
        email: "analyst@patilcybershield.com",
        password: "securePassword123"
      }
    };
    const loginRes = createMockRes();
    await login(loginReq, loginRes, mockNext);
    console.log("  Login Response:", loginRes.body.message);

    const authenticatedUser = loginRes.body.data.user;
    console.log("  Logged In User:", authenticatedUser.name, "[Role:", authenticatedUser.role, "]");

    // ----------------------------------------------------
    // TEST 2: User List and Status Control
    // ----------------------------------------------------
    console.log("\n[TEST 2] Verifying User List and Status Management...");
    const req2 = {};
    const res2 = createMockRes();
    await getUsers(req2, res2, mockNext);
    console.log("  Registered Users Found in System:", res2.body.data.length);
    if (res2.body.data.length !== 1) {
      throw new Error("Test 2 Failed: Incorrect registered users count.");
    }

    // Toggle status of user to Inactive
    const statusReq = {
      params: { id: authenticatedUser.id },
      body: { status: "Inactive" }
    };
    const statusRes = createMockRes();
    await updateUserStatus(statusReq, statusRes, mockNext);
    console.log("  Status Update Response Status:", statusRes.body.data.status);
    if (statusRes.body.data.status !== "Inactive") {
      throw new Error("Test 2 Failed: Status did not update to Inactive.");
    }
    console.log("  Test 2: PASSED");

    // ----------------------------------------------------
    // TEST 3: AI Security Copilot Chat (Gemini Integration)
    // ----------------------------------------------------
    console.log("\n[TEST 3] Testing AI Security Chat & Session History...");
    const req3 = {
      user: { _id: authenticatedUser.id },
      body: { prompt: "Explain CVE-2024-1024" }
    };
    const res3 = createMockRes();
    await aiChat(req3, res3, mockNext);
    console.log("  AI Copilot Reply length:", res3.body.data.reply.length);
    console.log("  AI Copilot Reply text (truncated):", res3.body.data.reply.slice(0, 150));

    const historyReq = {
      user: { _id: authenticatedUser.id }
    };
    const historyRes = createMockRes();
    await getChatHistory(historyReq, historyRes, mockNext);
    console.log("  AI Chat Log count:", historyRes.body.data.length);
    if (historyRes.body.data.length !== 2) { // 1 user message + 1 AI response
      throw new Error("Test 3 Failed: Chat history not recorded correctly.");
    }
    console.log("  Test 3: PASSED");

    // ----------------------------------------------------
    // TEST 4: Malware Sandbox Analyzer (Heuristics)
    // ----------------------------------------------------
    console.log("\n[TEST 4] Scanning suspicious script block in Malware Sandbox...");
    const req4 = {
      body: {
        fileName: "malicious_script.js",
        fileContent: "const exec = require('child_process').exec; eval('shell command'); fs.unlink('/var/log');"
      }
    };
    const res4 = createMockRes();
    await malwareAnalyze(req4, res4, mockNext);
    console.log("  Scan Threat Score:", res4.body.data.score);
    console.log("  Heuristic Analysis Level:", res4.body.data.threatLevel);
    console.log("  Details:", res4.body.data.details);

    const threats = await Threat.find({ type: "Malware Detected" });
    const alerts = await Alert.find({ message: /Malware payload/ });
    console.log("  Malware Threats Registered in DB:", threats.length);
    console.log("  Malware Alerts Triggered in DB:", alerts.length);
    if (threats.length !== 1 || alerts.length !== 1) {
      throw new Error("Test 4 Failed: Malware threat or alert not saved.");
    }
    console.log("  Test 4: PASSED");

    // ----------------------------------------------------
    // TEST 5: Malware Sandbox Upload Endpoint (Multer & saveRAMFiles)
    // ----------------------------------------------------
    console.log("\n[TEST 5] Testing Malware Sandbox Binary Upload Route...");
    const req5 = {
      app: {
        get: (key) => null // mock req.app.get("io")
      },
      tempFiles: [
        {
          buffer: Buffer.from("const exec = require('child_process').exec; eval('shell command');"),
          mimetype: "application/javascript",
          originalExt: ".js",
          finalPath: "uploads/malware/test_malware.js"
        }
      ]
    };
    const res5 = createMockRes();
    await malwareUpload(req5, res5, mockNext);
    console.log("  Upload Scan Score:", res5.body.data.score);
    console.log("  Upload Scan Status:", res5.body.data.threatLevel);
    console.log("  Upload Details:", res5.body.data.details);

    // Verify it was saved/logged
    const threatsAfterUpload = await Threat.find({ type: "Malware Detected" });
    console.log("  Malware Threats Registered in DB after upload:", threatsAfterUpload.length);
    if (threatsAfterUpload.length < 2) {
      throw new Error("Test 5 Failed: Binary upload threat not registered.");
    }
    console.log("  Test 5: PASSED");

    // ----------------------------------------------------
    // TEST 6: Vulnerability List and Patching
    // ----------------------------------------------------
    console.log("\n[TEST 6] Fetching and Patching System Vulnerabilities...");
    // Pre-populate a vulnerability
    const seedVuln = await Vulnerability.create({
      cve: "CVE-2023-4455",
      target: "10.0.0.5",
      severity: "High",
      component: "Nginx",
      description: "Improper configuration allows potential directory traversal.",
      status: "Open"
    });

    const listReq = {};
    const listRes = createMockRes();
    await getVulnerabilities(listReq, listRes, mockNext);
    console.log("  Vulnerabilities Found in DB:", listRes.body.data.length);
    if (listRes.body.data.length !== 1) {
      throw new Error("Test 6 Failed: Could not fetch vulnerability list.");
    }

    const patchReq = {
      params: { id: seedVuln._id.toString() },
      body: { status: "Resolved" }
    };
    const patchRes = createMockRes();
    await patchVulnerability(patchReq, patchRes, mockNext);
    console.log("  Patched Vuln Status in DB:", patchRes.body.data.status);
    if (patchRes.body.data.status !== "Resolved") {
      throw new Error("Test 6 Failed: Status did not update to Resolved.");
    }
    console.log("  Test 6: PASSED");

    console.log("\n=======================================================");
    console.log(" ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!");
    console.log("=======================================================");

  } catch (error) {
    console.error("\nTEST RUN ENCOUNTERED A FAILURE:");
    console.error(error);
    process.exit(1);
  } finally {
    // Cleanup Mongoose and Server
    await mongoose.connection.close();
    await mongoServer.stop();
    console.log("\nDatabase connection closed and MongoMemoryServer stopped.");
  }
}

runTests();
