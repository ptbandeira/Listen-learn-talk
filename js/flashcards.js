import { fetchData } from './utils.js';

let flashcards = [];
let currentCardIndex = 0;

async function initFlashcards() {
    const flashcardContainer = document.getElementById('flashcard-container');
    const flashcardFront = document.getElementById('flashcard-front');
    const flashcardBack = document.getElementById('flashcard-back');
    const flipBtn = document.getElementById('flip-btn');
    const nextBtn = document.getElementById('next-btn');

    try {
        flashcards = await fetchData('/api/flashcards');
        if (flashcards.length > 0) {
            displayFlashcard();
        } else {
            flashcardFront.innerHTML = '<p>No flashcards available.</p>';
            flashcardBack.innerHTML = '<p>No flashcards available.</p>';
        }
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        flashcardFront.innerHTML = '<p>Error loading flashcards.</p>';
        flashcardBack.innerHTML = '<p>Error loading flashcards.</p>';
    }

    flipBtn.addEventListener('click', () => {
        flashcardContainer.classList.toggle('[transform:rotateY(180deg)]');
    });

    nextBtn.addEventListener('click', () => {
        currentCardIndex = (currentCardIndex + 1) % flashcards.length;
        flashcardContainer.classList.remove('[transform:rotateY(180deg)]');
        setTimeout(displayFlashcard, 250); // Wait for the card to flip back
    });
}

function displayFlashcard() {
    const flashcard = flashcards[currentCardIndex];
    const flashcardFront = document.getElementById('flashcard-front');
    const flashcardBack = document.getElementById('flashcard-back');

    flashcardFront.innerHTML = `<p class="text-2xl">${flashcard.polish_word}</p>`
    flashcardBack.innerHTML = `<p class="text-2xl">${flashcard.english_translation}</p>`
}

export { initFlashcards };