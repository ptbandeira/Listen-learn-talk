const flashcards = [
    { "polish_word": "Cześć", "english_translation": "Hello" },
    { "polish_word": "Dziękuję", "english_translation": "Thank you" },
    { "polish_word": "Proszę", "english_translation": "Please" },
    { "polish_word": "Tak", "english_translation": "Yes" },
    { "polish_word": "Nie", "english_translation": "No" }
];

module.exports = (req, res) => {
    res.json(flashcards);
};