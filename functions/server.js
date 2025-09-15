require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const playwright = require('playwright-core');
const cheerio = require('cheerio');
const { generateContent } = require('./services/openai');
const prompts = require('./services/generatePrompts');
const functions = require('firebase-functions');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../../public')));

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

        const summary = await generateContent(text, prompts.summary);
        const vocabulary = await generateContent(text, prompts.vocabulary);
        const flashcards = await generateContent(text, prompts.flashcards);
        const sentences = await generateContent(text, prompts.sentences);
        const dialogues = await generateContent(text, prompts.dialogues);

        res.json({ 
            message: 'Content generated successfully!', 
            data: {
                summary,
                vocabulary,
                flashcards,
                sentences,
                dialogues
            }
        });
    } catch (error) {
        console.error('Error processing content:', error);
        res.status(500).json({ message: 'Failed to process content.' });
    }
});

exports.api = functions.https.onRequest(app);
