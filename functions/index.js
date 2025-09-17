require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const playwright = require('playwright-core');
const cheerio = require('cheerio');
const { generateContent, generateTutorResponse } = require('./services/openai');
const prompts = require('./services/generatePrompts');
const functions = require('firebase-functions');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../../public')));

// Route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Route for the generate view
app.get('/generate', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/generate.html'));
});

app.post('/api/generate', async (req, res) => {
    const { url, text: textInput } = req.body;

    let text = '';
    let title = '';

    try {
        if (url) {
            console.log(`Received URL: ${url}`);
            const browser = await playwright.chromium.launch();
            const page = await browser.newPage();
            await page.goto(url);
            title = await page.title();
            const content = await page.content();
            await browser.close();
            const $ = cheerio.load(content);
            text = $('body').text();
        } else if (textInput) {
            console.log('Received text input.');
            text = textInput;
            title = textInput.substring(0, 20) + "...";
        } else {
            return res.status(400).json({ message: 'URL or text input is required.' });
        }

        const [summary, vocabulary, flashcards, sentences, dialogues] = await Promise.all([
            generateContent(text, prompts.summary),
            generateContent(text, prompts.vocabulary),
            generateContent(text, prompts.flashcards),
            generateContent(text, prompts.sentences),
            generateContent(text, prompts.dialogues)
        ]);

        const newContent = {
            id: Date.now(), // Use a timestamp for a unique ID
            date: new Date().toISOString().split('T')[0],
            title: title,
            source: url || 'Pasted Text',
            type: url ? 'news' : 'text',
            summary: JSON.parse(summary).summary,
            vocabulary: JSON.parse(vocabulary).vocabulary,
            flashcards: JSON.parse(flashcards).flashcards,
            sentences: JSON.parse(sentences).sentences,
            dialogues: JSON.parse(dialogues).dialogues
        };

        const contentPath = path.join(__dirname, 'data/content.json');
        fs.readFile(contentPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading content.json:', err);
                return res.status(500).json({ message: 'Error reading content data' });
            }
            const content = JSON.parse(data);
            content.push(newContent);
            fs.writeFile(contentPath, JSON.stringify(content, null, 2), (err) => {
                if (err) {
                    console.error('Error writing content.json:', err);
                    return res.status(500).json({ message: 'Error writing content data' });
                }
                res.json({
                    message: 'Content generated and saved successfully!',
                    data: newContent
                });
            });
        });
    } catch (error) {
        console.error('Error processing content:', error);
        res.status(500).json({ message: 'Failed to process content.' });
    }
});

app.get('/api/content/:id', (req, res) => {
    const contentId = parseInt(req.params.id);
    fs.readFile(path.join(__dirname, 'data/content.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading content.json:', err);
            res.status(500).json({ message: 'Error reading content data' });
            return;
        }
        const content = JSON.parse(data);
        const singleContent = content.find(item => item.id === contentId);
        if (singleContent) {
            res.json(singleContent);
        } else {
            res.status(404).json({ message: 'Content not found' });
        }
    });
});

app.get('/api/dialogues', (req, res) => {
    fs.readFile(path.join(__dirname, 'data/dialogues.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading dialogues.json:', err);
            res.status(500).json({ message: 'Error reading dialogues data' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.get('/api/sentences', (req, res) => {
    fs.readFile(path.join(__dirname, 'data/content.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading content.json:', err);
            res.status(500).json({ message: 'Error reading sentences data' });
            return;
        }
        const content = JSON.parse(data);
        const sentences = content.reduce((acc, item) => acc.concat(item.sentences), []);
        res.json(sentences);
    });
});

app.get('/api/all-vocabulary', (req, res) => {
    fs.readFile(path.join(__dirname, 'data/content.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading content.json:', err);
            res.status(500).json({ message: 'Error reading wordbook data' });
            return;
        }
        const content = JSON.parse(data);
        const wordbook = content.reduce((acc, item) => acc.concat(item.vocabulary), []);
        res.json(wordbook);
    });
});

app.post('/api/wordbook', (req, res) => {
    const { word } = req.body;
    const wordbookPath = path.join(__dirname, 'data/wordbook.json');
    fs.readFile(wordbookPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading wordbook.json:', err);
            return res.status(500).json({ message: 'Error reading wordbook data' });
        }
        const wordbook = JSON.parse(data);
        wordbook.push(word);
        fs.writeFile(wordbookPath, JSON.stringify(wordbook, null, 2), (err) => {
            if (err) {
                console.error('Error writing wordbook.json:', err);
                return res.status(500).json({ message: 'Error writing wordbook data' });
            }
            res.json({ message: 'Word added to wordbook successfully!' });
        });
    });
});

app.get('/api/my-wordbook', (req, res) => {
    fs.readFile(path.join(__dirname, 'data/wordbook.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading wordbook.json:', err);
            res.status(500).json({ message: 'Error reading wordbook data' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/generate-practice-sentences', async (req, res) => {
    const { words } = req.body;

    if (!words || !Array.isArray(words) || words.length === 0) {
        return res.status(400).json({ message: 'A list of words is required.' });
    }

    try {
        const text = words.join(', ');
        const sentences = await generateContent(text, prompts.practiceSentences);
        res.json(JSON.parse(sentences));
    } catch (error) {
        console.error('Error generating practice sentences:', error);
        res.status(500).json({ message: 'Failed to generate practice sentences.' });
    }
});

app.post('/api/tutor', async (req, res) => {
    const { messages } = req.body;

    if (!messages) {
        return res.status(400).json({ message: 'Messages are required.' });
    }

    try {
        const reply = await generateTutorResponse(messages, prompts.tutor);
        res.json(JSON.parse(reply));
    } catch (error) {
        console.error('Error with tutor endpoint:', error);
        res.status(500).json({ message: 'Failed to get response from tutor.' });
    }
});

exports.api = functions.https.onRequest(app);
