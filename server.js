const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const util = require("util");
const { v4: uuidv4 } = require("uuid");
const { Router } = require("express");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const PORT = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// GET requests for HTML routes

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./public/index.html"));
// });

// GET request for API routes to read and return all saved notes as JSON
app.get("/api/notes", (req, res) => {
  return readFile("db/db.json", "utf-8")
    .then((notes) => [].concat(JSON.parse(notes)))
    .then((notesArray) => res.json(notesArray))
    .catch((err) => res.json(err));
});

// POST request receive a new note to save on the request body, and return the new note to the client.
app.post("/api/notes", (req, res) => {
  // Log that a POST request was received
  return readFile("db/db.json", "utf-8")
    .then((notes) => [].concat(JSON.parse(notes)))
    .then((notesArray) => {
      var noteObject = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4(),
      };
      var newArray = [...notesArray, noteObject];

      writeFile("db/db.json", JSON.stringify(newArray)).then(() =>
        res.json({ msg: "SUCCESS!" })
      );
    });
});

app.delete("/api/notes/:id", (req, res) => {
  return (
    readFile("db/db.json", "utf-8")
      .then((notes) => [].concat(JSON.parse(notes)))
      // try expanding this out by storing in a const
      .then((oldArray) =>
        oldArray
          .filter((note) => note.id !== req.params.id)
          .then((newArray) =>
            writeFile("db/db.json", JSON.stringify(newArray)).then(() =>
              res.json({ msg: "SUCCESS!" })
            )
          )
      )
  );
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
