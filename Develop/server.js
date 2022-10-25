const express = require("express");
const app = express();
const path = require("path");
const notesData = require("./db/db.json");

const PORT = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// GET requests for HTML routes

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// GET request for API routes to read and return all saved notes as JSON
app.get("/api/notes", (req, res) => res.status(200).json(notesData));

// POST request receive a new note to save on the request body, and return the new note to the client.
app.post("/api/notes", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a new note`);
  // review 18-Stu_POST-Fetch to finish writing this request
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
