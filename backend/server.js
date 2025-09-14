const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const aiService = require('./ai-service');
const db = require('./db');
const contentRepository = require('./content-repository');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/generate-content', async (req, res) => {
  try {
    const content = await aiService.generateContent();
    // Super simple parsing, assuming the format is always the same
    const [polish, english] = content.split('\n\n'); 
    await contentRepository.saveContent(polish, english);
    res.json({ content: { polish_text: polish, english_text: english } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

app.get('/api/content', async (req, res) => {
  try {
    const content = await contentRepository.getLatestContent();
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve content' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
