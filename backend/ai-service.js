const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function generateContent() {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const prompt = "Write a short, simple dialogue in Polish for a beginner learner. The dialogue should be about a common daily situation, like ordering a coffee. Include the English translation.";

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
}

module.exports = { generateContent };
