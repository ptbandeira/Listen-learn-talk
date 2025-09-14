const dialogues = [
    {
        "title": "At the Restaurant",
        "conversation": [
            { "speaker": "Waiter", "line": "Dzień dobry. Co podać?" },
            { "speaker": "Customer", "line": "Poproszę pierogi ruskie." },
            { "speaker": "Waiter", "line": "Coś do picia?" },
            { "speaker": "Customer", "line": "Wodę gazowaną, proszę." }
        ]
    },
    {
        "title": "Asking for Directions",
        "conversation": [
            { "speaker": "Tourist", "line": "Przepraszam, jak dojść do dworca?" },
            { "speaker": "Local", "line": "Prosto, a potem w lewo." },
            { "speaker": "Tourist", "line": "Dziękuję." },
            { "speaker": "Local", "line": "Proszę." }
        ]
    }
];

module.exports = (req, res) => {
    res.json(dialogues);
};