const express = require("express");
const cors = require("cors");
const triageEnquiry = require("./triage.js");
const categories = require("./categories.json");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/triage", (req, res) => {
  const userText = req.body.text;
  const result = triageEnquiry(userText);
  res.json(result);
});

// Returns just the category names, for the frontend to build category buttons
app.get("/categories", (req, res) => {
  const names = categories.map((c) => c.name);
  res.json(names);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
