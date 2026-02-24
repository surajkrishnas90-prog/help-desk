const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ===============================
   MIDDLEWARES
================================ */

// TEMP: Allow all origins (stable for deployment)
app.use(cors());

app.use(express.json());

/* ===============================
   TEST ROUTE (Health Check)
================================ */

app.get("/", (req, res) => {
  res.send("API is running");
});

/* ===============================
   DATABASE
================================ */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

/* ===============================
   ROUTES
================================ */

app.use("/api/auth", require("./routes/auth"));
app.use("/api/tickets", require("./routes/tickets"));

/* ===============================
   SERVER
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});