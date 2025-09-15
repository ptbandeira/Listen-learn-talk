const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const got = require("got");
const metascraper = require("metascraper")([
  require("metascraper-author")(),
  require("metascraper-date")(),
  require("metascraper-description")(),
  require("metascraper-image")(),
  require("metascraper-logo")(),
  require("metascraper-publisher")(),
  require("metascraper-title")(),
  require("metascraper-url")(),
]);
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  const { url, text } = req.body;

  if (!url && !text) {
    return res.status(400).json({ error: "URL or text is required" });
  }

  let contentToSummarize;

  if (url) {
    try {
      const { body: html, url: targetUrl } = await got(url);
      const metadata = await metascraper({ html, url: targetUrl });
      contentToSummarize = metadata.description || metadata.title;
    } catch (error) {
      console.error("Error fetching URL:", error);
      return res.status(500).json({ error: "Could not fetch content from the URL" });
    }
  } else {
    contentToSummarize = text;
  }

  if (!contentToSummarize) {
    return res.status(500).json({ error: "Could not extract content" });
  }

  const prompt = `
    Please summarize the following text and generate a list of 20 flashcards.
    Respond with ONLY a valid JSON object in the following format:
    {
      "summary": "a few sentences long summary",
      "flashcards": [
        {"front": "front of card", "back": "back of card"},
        {"front": "front of card", "back": "back of card"}
      ]
    }

    Text:
    ${contentToSummarize}
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes text and creates flashcards. You only respond with valid JSON." },
        { role: "user", content: prompt },
      ],
    });

    const content = completion.choices[0].message.content;

    try {
        const parsedContent = JSON.parse(content);
        res.json(parsedContent);
    } catch(e) {
        console.error("Could not parse JSON response from AI model:", e);
        console.error("Invalid JSON received:", content);
        return res.status(500).json({ error: "Could not parse response from AI model" });
    }
  } catch (error) {
    console.error("Error with OpenAI:", error);
    res.status(500).json({ error: "An error occurred while generating content" });
  }
});

app.get("/flashcards", (req, res) => {
  // Placeholder for flashcard fetching logic
  res.json([
    {
      front: "Hello",
      back: "World",
    },
  ]);
});

exports.api = functions.https.onRequest(app);
