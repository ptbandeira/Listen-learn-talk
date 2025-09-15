import { fetchData } from './utils.js';

export function initSentences() {
    const sentenceContainer = document.getElementById('sentence-container');
    const newSentenceBtn = document.getElementById('new-sentence-btn');

    let sentences = [];
    let currentSentence = 0;

    async function loadSentences() {
        sentences = await fetchData('http://localhost:8000/api/sentences');
        renderSentence();
    }

    function renderSentence() {
        if (currentSentence >= sentences.length) {
            sentenceContainer.innerHTML = '<p>No more sentences!</p>';
            return;
        }

        const sentence = sentences[currentSentence];
        sentenceContainer.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <p class="text-xl mb-4">${sentence.polish_sentence}</p>
                <div class="flex space-x-4">
                    ${sentence.options.map(option => `<button class="bg-gray-200 px-4 py-2 rounded-lg">${option}</button>`).join('')}
                </div>
            </div>
        `;
    }

    newSentenceBtn.addEventListener('click', () => {
        currentSentence++;
        renderSentence();
    });

    loadSentences();
}
