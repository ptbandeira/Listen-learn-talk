const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));

app.post("/generate", (req, res) => {
  // Placeholder for content generation logic
  res.json({ message: "Content generation is not yet implemented." });
});

app.get("/flashcards", (req, res) => {
  // Placeholder for flashcard fetching logic
  res.json([{
    front: "Hello",
    back: "World"
  }]);
});

exports.api = functions.https.onRequest(app);
