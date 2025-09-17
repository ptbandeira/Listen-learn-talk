const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cheerio = require('cheerio');
const { generateContent, generateTutorResponse } = require('./services/openai');
const prompts = require('./services/generatePrompts');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const got = require('got');
const metascraper = require('metascraper')([
    require('metascraper-author')(),
    require('metascraper-date')(),
    require('metascraper-description')(),
    require('metascraper-image')(),
    require('metascraper-logo')(),
    require('metascraper-publisher')(),
    require('metascraper-title')(),
    require('metascraper-url')()
]);

admin.initializeApp({
    databaseURL: "https://anylingo-2b0c7.firebaseio.com"
});
const db = admin.database();

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
    console.log('Received request for /api/generate');
    const { url, text: textInput } = req.body;
    console.log('Request body:', req.body);

    let text = '';
    let title = '';

    try {
        if (url) {
            console.log(`Received URL: ${url}`);
            const { body: html, url: finalUrl } = await got(url);
            const metadata = await metascraper({ html, url: finalUrl });
            title = metadata.title;
            const $ = cheerio.load(html);
            text = $('body').text();
            console.log('Text extracted from URL:', text.substring(0, 100) + '...');
        } else if (textInput) {
            console.log('Received text input.');
            text = textInput;
            title = textInput.substring(0, 20) + "...";
            console.log('Text input:', text.substring(0, 100) + '...');
        } else {
            console.log('URL or text input is required.');
            return res.status(400).json({ message: 'URL or text input is required.' });
        }

        console.log('Generating content from OpenAI...');
        const [summary, vocabulary, flashcards, sentences, dialogues] = await Promise.all([
            generateContent(text, prompts.summary),
            generateContent(text, prompts.vocabulary),
            generateContent(text, prompts.flashcards),
            generateContent(text, prompts.sentences),
            generateContent(text, prompts.dialogues)
        ]);

        console.log('Content generated from OpenAI.');

        const newContentRef = db.ref('content').push();
        const newContent = {
            id: newContentRef.key,
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

        await newContentRef.set(newContent);

        console.log('Content saved successfully.');
        res.json({
            message: 'Content generated and saved successfully!',
            data: newContent
        });
    } catch (error) {
        console.error('Error processing content:', error);
        res.status(500).json({ message: 'Failed to process content.' });
    }
});

app.get('/api/content/:id', async (req, res) => {
    const contentId = req.params.id;
    try {
        const snapshot = await db.ref(`content/${contentId}`).once('value');
        const singleContent = snapshot.val();
        if (singleContent) {
            res.json(singleContent);
        } else {
            res.status(404).json({ message: 'Content not found' });
        }
    } catch (error) {
        console.error('Error reading content:', error);
        res.status(500).json({ message: 'Error reading content data' });
    }
});

app.get('/api/dialogues', async (req, res) => {
    try {
        const snapshot = await db.ref('content').once('value');
        const content = snapshot.val();
        const dialogues = Object.values(content).reduce((acc, item) => acc.concat(item.dialogues || []), []);
        res.json(dialogues);
    } catch (error) {
        console.error('Error reading dialogues:', error);
        res.status(500).json({ message: 'Error reading dialogues data' });
    }
});

app.get('/api/sentences', async (req, res) => {
    try {
        const snapshot = await db.ref('content').once('value');
        const content = snapshot.val();
        const sentences = Object.values(content).reduce((acc, item) => acc.concat(item.sentences || []), []);
        res.json(sentences);
    } catch (error) {
        console.error('Error reading sentences:', error);
        res.status(500).json({ message: 'Error reading sentences data' });
    }
});

app.get('/api/all-vocabulary', async (req, res) => {
    try {
        const snapshot = await db.ref('content').once('value');
        const content = snapshot.val();
        const wordbook = Object.values(content).reduce((acc, item) => acc.concat(item.vocabulary || []), []);
        res.json(wordbook);
    } catch (error) {
        console.error('Error reading vocabulary:', error);
        res.status(500).json({ message: 'Error reading wordbook data' });
    }
});

app.post('/api/wordbook', async (req, res) => {
    const { word } = req.body;
    try {
        const newWordRef = db.ref('wordbook').push();
        await newWordRef.set(word);
        res.json({ message: 'Word added to wordbook successfully!' });
    } catch (error) {
        console.error('Error writing to wordbook:', error);
        res.status(500).json({ message: 'Error writing wordbook data' });
    }
});

app.get('/api/my-wordbook', async (req, res) => {
    try {
        const snapshot = await db.ref('wordbook').once('value');
        const wordbook = snapshot.val();
        res.json(Object.values(wordbook || {}));
    } catch (error) {
        console.error('Error reading wordbook:', error);
        res.status(500).json({ message: 'Error reading wordbook data' });
    }
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
