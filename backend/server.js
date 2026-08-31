const express = require("express");
const cors = require("cors");
const triageEnquiry = require("./triage.js");

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


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
