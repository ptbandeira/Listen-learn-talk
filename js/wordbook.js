document.addEventListener('DOMContentLoaded', () => {
    const wordbookContainer = document.querySelector('.divide-y.divide-gray-700\\/50');
    const searchInput = document.querySelector('.form-input');
    const filterButton = document.querySelector('.flex.items-center.gap-1.text-sm');
    const addWordButton = document.querySelector('.fixed.bottom-0.right-0.p-6 button');

    let allWords = [];
    let learnedWords = [];

    async function fetchAllWords() {
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

    function getLearnedWords() {
        return JSON.parse(localStorage.getItem('learnedWords')) || [];
    }

    function renderWordbook(words) {
        wordbookContainer.innerHTML = '';
        const learnedWordObjects = allWords.filter(word => words.includes(word.pl));

        learnedWordObjects.forEach(word => {
            const wordEl = document.createElement('div');
            wordEl.className = 'flex items-center gap-4 bg-[#1A202C] px-4 py-4 justify-between hover:bg-gray-800 transition-colors duration-200';
            wordEl.innerHTML = `
                <div class="flex-grow">
                    <p class="text-white text-lg font-medium leading-normal">${word.pl}</p>
                    <p class="text-gray-400 text-sm font-normal leading-normal">${word.en}</p>
                </div>
                <div class="shrink-0">
                    <button class="text-white flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                        <span class="material-symbols-outlined"> volume_up </span>
                    </button>
                </div>
            `;
            wordbookContainer.appendChild(wordEl);
        });
    }

    function filterWords() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredWords = learnedWords.filter(word => word.toLowerCase().includes(searchTerm));
        const learnedWordObjects = allWords.filter(word => filteredWords.includes(word.pl));
        renderWordbook(filteredWords);
    }

    searchInput.addEventListener('input', filterWords);

    filterButton.addEventListener('click', () => {
        alert('Filter functionality is not implemented yet.');
    });

    addWordButton.addEventListener('click', () => {
        alert('Add new word functionality is not implemented yet.');
    });

    async function init() {
        allWords = await fetchAllWords();
        learnedWords = getLearnedWords();
        renderWordbook(learnedWords);
    }

    init();
});
