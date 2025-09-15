const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

// API routes
const flashcards = require('./api/flashcards');
const sentences = require('./api/sentences');
const dialogues = require('./api/dialogues');
const wordbook = require('./api/wordbook');

app.get('/api/flashcards', flashcards);
app.get('/api/sentences', sentences);
app.get('/api/dialogues', dialogues);
app.get('/api/wordbook', wordbook);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
