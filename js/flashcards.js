import { fetchData } from './utils.js';

export function initFlashcards() {
    const flashcardContainer = document.getElementById('flashcard-container');
    const newFlashcardBtn = document.getElementById('new-flashcard-btn');

    let flashcards = [];
    let currentCard = 0;

    async function loadFlashcards() {
        flashcards = await fetchData('http://localhost:8000/api/flashcards');
        renderFlashcard();
    }

    function renderFlashcard() {
        if (!flashcardContainer) return;
        if (currentCard >= flashcards.length) {
            flashcardContainer.innerHTML = '<p>No more flashcards!</p>';
            return;
        }

        const card = flashcards[currentCard];
        flashcardContainer.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg text-center">
                <p class="text-2xl font-bold">${card.polish_word}</p>
                <p class="text-gray-600">${card.english_translation}</p>
            </div>
        `;
    }

    if (newFlashcardBtn) {
        newFlashcardBtn.addEventListener('click', () => {
            currentCard++;
            renderFlashcard();
        });
    }

    loadFlashcards();
}
