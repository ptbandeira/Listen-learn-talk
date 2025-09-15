import { fetchData } from './utils.js';
import { API_URL } from './config.js';

export function initWordbook() {
    const wordbookContainer = document.getElementById('wordbook-container');

    async function loadWordbook() {
        const wordbook = await fetchData(`${API_URL}/wordbook`);
        renderWordbook(wordbook);
    }

    function renderWordbook(wordbook) {
        wordbookContainer.innerHTML = `
            <ul class="bg-white p-6 rounded-lg shadow-lg">
                ${wordbook.map(word => `<li class="flex justify-between items-center py-2 border-b">
                    <span>${word.polish_word}</span>
                    <span>${word.english_translation}</span>
                </li>`).join('')}
            </ul>
        `;
    }

    loadWordbook();
}
