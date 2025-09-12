document.addEventListener('DOMContentLoaded', () => {
    const flashcard = document.getElementById('flashcard');
    const flashcardFrontText = document.querySelector('.flip-card-front .text-4xl');
    const flashcardBackText = document.querySelector('.flip-card-back .text-4xl');
    const sourceText = document.querySelector('.flip-card-front .text-sm');
    const nextButton = document.querySelector('.flex-1.rounded-xl.h-12.bg-\\[var\\(--sapphire-blue\\)\\]');
    const markAsLearnedButton = document.querySelector('.flex-1.flex.items-center.justify-center');
    const progressText = document.querySelector('.text-\\[var\\(--dark-gray\\)\\].font-semibold');

    let vocabulary = [];
    let currentIndex = 0;
    let isFlipping = false;
    let learnedWords = [];

    async function fetchVocabulary() {
        try {
            const response = await fetch('http://localhost:3000/api/vocabulary');
            if (!response.ok) {
                throw new Error('Failed to fetch vocabulary');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching vocabulary:', error);
            return [];
        }
    }

    async function fetchLearnedWords() {
        try {
            const response = await fetch('http://localhost:3000/api/learned-words');
            if (!response.ok) {
                throw new Error('Failed to fetch learned words');
            }
            learnedWords = await response.json();
        } catch (error) {
            console.error('Error fetching learned words:', error);
        }
    }

    function renderCard() {
        if (vocabulary.length > 0) {
            const currentWord = vocabulary[currentIndex];
            flashcardFrontText.textContent = currentWord.pl;
            flashcardBackText.textContent = currentWord.en;
            progressText.textContent = `${currentIndex + 1} / ${vocabulary.length}`;
            flashcard.classList.remove('flipped');
            updateLearnedButton(currentWord.pl);
        }
    }

    function updateLearnedButton(word) {
        if (learnedWords.includes(word)) {
            markAsLearnedButton.textContent = 'Learned!';
            markAsLearnedButton.classList.add('bg-green-500', 'text-white');
            markAsLearnedButton.disabled = true;
        } else {
            markAsLearnedButton.textContent = 'Mark as Learned';
            markAsLearnedButton.classList.remove('bg-green-500', 'text-white');
            markAsLearnedButton.disabled = false;
        }
    }

    async function toggleLearnedStatus() {
        const currentWord = vocabulary[currentIndex].pl;
        if (!learnedWords.includes(currentWord)) {
            try {
                const response = await fetch('http://localhost:3000/api/learned-words', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ word: currentWord }),
                });
                if (!response.ok) {
                    throw new Error('Failed to mark word as learned');
                }
                learnedWords = await response.json();
                updateLearnedButton(currentWord);
            } catch (error) {
                console.error('Error marking word as learned:', error);
            }
        }
    }

    function nextCard() {
        if (vocabulary.length > 0) {
            currentIndex = (currentIndex + 1) % vocabulary.length;
            renderCard();
        }
    }

    function flipCard() {
        if (isFlipping) return;
        isFlipping = true;
        flashcard.classList.toggle('flipped');
        setTimeout(() => {
            isFlipping = false;
        }, 600);
    }

    flashcard.addEventListener('click', flipCard);
    nextButton.addEventListener('click', nextCard);
    markAsLearnedButton.addEventListener('click', toggleLearnedStatus);

    async function init() {
        await fetchLearnedWords();
        vocabulary = await fetchVocabulary();
        renderCard();
    }

    init();
});
