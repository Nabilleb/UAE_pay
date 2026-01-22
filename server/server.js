require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const jwt = require("jsonwebtoken");

const app = express();

// CORS Configuration from env
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY;
const PORT = process.env.PORT;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: process.env.DB_TRUST_CERT === "true",
    encrypt: process.env.DB_ENCRYPT === "true"
  }
};

// Validate required environment variables
if (!JWT_SECRET || !PORT || !dbConfig.user || !dbConfig.password || !dbConfig.server || !dbConfig.database) {
  console.error("❌ Missing required environment variables. Check your .env file.");
  process.exit(1);
}

async function getPool() {
  return sql.connect(dbConfig);
}

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("usrID", sql.VarChar(50), username)
      .input("usrPWD", sql.VarChar(50), password)
      .query("SELECT usrID FROM dbo.tblUsers WHERE usrID=@usrID AND usrPWD=@usrPWD");

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ usrID: username }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    res.json({ token });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
});

// ✅ Get employees
app.get("/api/employees", auth, async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(
      "SELECT empPSC, empTagId, empProjID FROM dbo.tblEmployee ORDER BY empPSC"
    );
    res.json(result.recordset);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
});

// ✅ Update empTagId and empProjID
app.put("/api/employees/:empPSC", auth, async (req, res) => {
  const { empPSC } = req.params;
  const { empTagId, empProjID } = req.body;

  try {
    const pool = await getPool();
    await pool
      .request()
      .input("empPSC", sql.VarChar(50), empPSC)
      .input("empTagId", sql.VarChar(50), empTagId)
      .input("empProjID", sql.Int, empProjID || null)
      .query("UPDATE dbo.tblEmployee SET empTagId=@empTagId, empProjID=@empProjID WHERE empPSC=@empPSC");

    res.json({ message: "Updated" });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
});

// ✅ Get projects
app.get("/api/projects", auth, async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(
      "SELECT prjSeq, prjDesc FROM dbo.tblProjects ORDER BY prjDesc"
    );
    res.json(result.recordset);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: String(e) });
  }
});

app.listen(5000, () => console.log("API running on http://localhost:5000"));
