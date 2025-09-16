require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generateContent(text, prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-1106',
            response_format: { type: "json_object" },
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that generates educational content based on a given text and returns the content in JSON format.'
                },
                {
                    role: 'user',
                    content: `${prompt}\n\n${text}`
                }
            ]
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error generating content:', error);
        throw new Error('Failed to generate content.');
    }
}

module.exports = { generateContent };
