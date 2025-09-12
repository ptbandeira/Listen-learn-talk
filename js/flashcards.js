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
    let learnedWords = JSON.parse(localStorage.getItem('learnedWords')) || [];

    async function fetchVocabulary() {
        try {
            const response = await fetch('data/vocabulary.json');
            if (!response.ok) {
                throw new Error('Failed to fetch vocabulary.json');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching vocabulary:', error);
            return [];
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

    function toggleLearnedStatus() {
        const currentWord = vocabulary[currentIndex].pl;
        if (!learnedWords.includes(currentWord)) {
            learnedWords.push(currentWord);
            localStorage.setItem('learnedWords', JSON.stringify(learnedWords));
            updateLearnedButton(currentWord);
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
        vocabulary = await fetchVocabulary();
        renderCard();
    }

    init();
});
