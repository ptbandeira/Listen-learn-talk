const sentences = [
    { "polish_sentence": "Lubię ____ jabłka.", "options": ["jeść", "pić", "spać"], "correct_answer": "jeść" },
    { "polish_sentence": "On ____ do szkoły.", "options": ["idzie", "biegnie", "płynie"], "correct_answer": "idzie" },
    { "polish_sentence": "Czy ____ mi pomóc?", "options": ["możesz", "chcesz", "musisz"], "correct_answer": "możesz" }
];

module.exports = (req, res) => {
    res.json(sentences);
};