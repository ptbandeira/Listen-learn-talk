const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

const dataFolderPath = path.join(__dirname, 'data');

app.get('/api/vocabulary', async (req, res) => {
    try {
        const filePath = path.join(dataFolderPath, 'vocabulary.json');
        const data = await fs.readFile(filePath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).send('Error reading vocabulary data');
    }
});

app.get('/api/dialogues', async (req, res) => {
    try {
        const filePath = path.join(dataFolderPath, 'dialogues.json');
        const data = await fs.readFile(filePath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).send('Error reading dialogues data');
    }
});

app.get('/api/content', async (req, res) => {
    try {
        const filePath = path.join(dataFolderPath, 'content.json');
        const data = await fs.readFile(filePath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).send('Error reading content data');
    }
});

const learnedWordsFilePath = path.join(__dirname, 'learned-words.json');

app.get('/api/learned-words', async (req, res) => {
    try {
        const data = await fs.readFile(learnedWordsFilePath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).send('Error reading learned words data');
    }
});

app.post('/api/learned-words', async (req, res) => {
    try {
        const { word } = req.body;
        if (!word) {
            return res.status(400).send('Word is required');
        }

        const data = await fs.readFile(learnedWordsFilePath, 'utf-8');
        const learnedWords = JSON.parse(data);

        if (!learnedWords.includes(word)) {
            learnedWords.push(word);
            await fs.writeFile(learnedWordsFilePath, JSON.stringify(learnedWords, null, 2));
        }

        res.status(200).json(learnedWords);
    } catch (error) {
        res.status(500).send('Error updating learned words data');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
