import { fetchData } from './utils.js';

let wordbook = [];

async function initWordbook() {
    const wordbookContainer = document.getElementById('wordbook-container');
    const searchInput = document.getElementById('search-word');

    try {
        wordbook = await fetchData('/api/wordbook');
        displayWordbook(wordbook);
    } catch (error) {
        console.error('Error fetching wordbook:', error);
        wordbookContainer.innerHTML = '<p>Error loading wordbook.</p>';
    }

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredWordbook = wordbook.filter(word => 
            word.polish_word.toLowerCase().includes(searchTerm) || 
            word.english_translation.toLowerCase().includes(searchTerm)
        );
        displayWordbook(filteredWordbook);
    });
}

function displayWordbook(words) {
    const wordbookContainer = document.getElementById('wordbook-container');
    wordbookContainer.innerHTML = words.map(word => `
        <div class="p-4 bg-white rounded-lg shadow-md">
            <h3 class="text-lg font-bold text-[var(--primary-color)]">${word.polish_word}</h3>
            <p class="text-gray-600">${word.english_translation}</p>
        </div>
    `).join('');
}

export { initWordbook };