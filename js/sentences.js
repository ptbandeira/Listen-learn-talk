import { fetchData } from './utils.js';

let sentences = [];
let currentSentenceIndex = 0;

async function initSentences() {
    const sentenceContainer = document.getElementById('sentence-container');
    const nextBtn = document.getElementById('next-sentence-btn');

    try {
        sentences = await fetchData('/api/sentences');
        if (sentences.length > 0) {
            displaySentence();
        } else {
            sentenceContainer.innerHTML = '<p>No sentences available.</p>';
        }
    } catch (error) {
        console.error('Error fetching sentences:', error);
        sentenceContainer.innerHTML = '<p>Error loading sentences.</p>';
    }

    nextBtn.addEventListener('click', () => {
        currentSentenceIndex = (currentSentenceIndex + 1) % sentences.length;
        displaySentence();
    });
}

function displaySentence() {
    const sentence = sentences[currentSentenceIndex];
    const sentenceContainer = document.getElementById('sentence-container');

    const sentenceHTML = `
        <p class="text-xl mb-4">${sentence.polish_sentence.replace('___', '<span class="font-bold text-[var(--primary-color)]">___</span>')}</p>
        <div class="flex flex-col gap-2">
            ${sentence.options.map(option => `<button class="option-btn p-3 bg-gray-100 rounded-lg text-left hover:bg-gray-200">${option}</button>`).join('')}
        </div>
        <p id="feedback" class="mt-4"></p>
    `;

    sentenceContainer.innerHTML = sentenceHTML;

    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedOption = button.textContent;
            const feedback = document.getElementById('feedback');
            if (selectedOption === sentence.correct_answer) {
                feedback.textContent = 'Correct!';
                feedback.classList.add('text-green-600');
                feedback.classList.remove('text-red-600');
            } else {
                feedback.textContent = 'Incorrect. Try again.';
                feedback.classList.add('text-red-600');
                feedback.classList.remove('text-green-600');
            }
        });
    });
}

export { initSentences };