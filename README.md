# Anylingo

Anylingo is a web application that helps users learn languages from any URL. Simply provide a URL, and Anylingo will generate a variety of educational materials to help you learn.

## Features

- **Content Extraction:** Anylingo can extract the text content from any provided URL.
- **AI-Powered Content Generation:** Using OpenAI's GPT-3.5 Turbo, Anylingo generates the following educational materials:
    - **Summary:** A concise summary of the text.
    - **Vocabulary:** A list of key vocabulary with their definitions.
    - **Flashcards:** A list of flashcards with terms and definitions.
    - **Example Sentences:** Sentences using the key vocabulary.
    - **Dialogues:** A dialogue between two people based on the text.

## Getting Started

### Prerequisites

- Node.js
- npm
- An OpenAI API key

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/anylingo.git
   cd anylingo
   ```

2. **Install the dependencies:**

   ```bash
   npm install
   ```

3. **Set up your environment variables:**

   Create a `.env` file in the `backend` directory and add your OpenAI API key:

   ```
   OPENAI_API_KEY=your-openai-api-key
   ```

### Running the Application

1. **Start the backend server:**

   ```bash
   npm start
   ```

2. **Open the `index.html` file in your browser.**

   You can now enter a URL and start learning!
