const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ===============================
   MIDDLEWARES
================================ */

// CORS (Netlify + Localhost)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://roaring-panda-1b0386.netlify.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests
app.options("*", cors());

// Body parser
app.use(express.json());


/* ===============================
   HEALTH CHECK
================================ */

app.get("/", (req, res) => {
  res.status(200).send("API is running");
});


/* ===============================
   DATABASE
================================ */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
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