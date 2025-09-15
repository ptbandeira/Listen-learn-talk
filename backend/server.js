require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const playwright = require('playwright-core');
const cheerio = require('cheerio');

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, '..')));


// API routes
const flashcards = require('./api/flashcards');
const sentences = require('./api/sentences');
const dialogues = require('./api/dialogues');
const wordbook = require('./api/wordbook');

app.get('/api/flashcards', flashcards);
app.get('/api/sentences', sentences);
app.get('/api/dialogues', dialogues);
app.get('/api/wordbook', wordbook);

app.post('/api/generate', async (req, res) => {
    const { url } = req.body;
    console.log(`Received URL: ${url}`);

    try {
        const browser = await playwright.chromium.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const content = await page.content();
        await browser.close();

        const $ = cheerio.load(content);
        const text = $('body').text();
        console.log(text);

        res.json({ message: 'Content downloaded and parsed successfully!' });
    } catch (error) {
        console.error('Error processing content:', error);
        res.status(500).json({ message: 'Failed to process content.' });
    }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
