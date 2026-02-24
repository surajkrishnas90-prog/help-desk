const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ===============================
   MIDDLEWARES
================================ */

const allowedOrigins = [
  "http://localhost:3000",
  "https://roaring-panda-1b0386.netlify.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman / curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS not allowed"));
  },
  credentials: true
}));

app.use(express.json());

/* ===============================
   HEALTH CHECK
================================ */

app.get("/", (req, res) => {
  res.status(200).json({ status: "API running" });
});

/* ===============================
   DATABASE
================================ */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.error("MongoDB Error:", err.message);
    process.exit(1);
  });

/* ===============================
   ROUTES
================================ */

app.use("/api/auth", require("./routes/auth"));
app.use("/api/tickets", require("./routes/tickets"));

/* ===============================
   SERVER
================================ */

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});