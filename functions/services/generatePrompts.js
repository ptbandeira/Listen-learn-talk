const prompts = {
    summary: 'Provide a concise summary of the following text. The response should be a JSON object with a "summary" key containing the summary string.',
    vocabulary: 'Extract key vocabulary from the following text. Return a JSON object with a "vocabulary" key containing an array of objects, where each object has "pl" (polish) and "en" (english) keys.',
    flashcards: 'Generate a list of flashcards from the following text. Return a JSON object with a "flashcards" key containing an array of objects, where each object has "polish" and "english" keys.',
    sentences: 'Generate a list of example sentences using key vocabulary from the following text. Return a JSON object with a "sentences" key containing an array of objects, where each object has "pl" and "en" keys.',
    dialogues: 'Create a dialogue between two people based on the content of the following text. Return a JSON object with a "dialogues" key containing an array of dialogue objects. Each dialogue object should have a "title" and a "conversation" array with "character" and "line" keys.'
};

module.exports = prompts;
