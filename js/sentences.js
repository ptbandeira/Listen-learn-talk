document.addEventListener('DOMContentLoaded', () => {
    const sentencesContainer = document.querySelector('.mt-6.space-y-4');
    const sourceTitle = document.querySelector('.font-semibold');

    async function fetchContent() {
        try {
            const response = await fetch('http://localhost:3000/api/content');
            if (!response.ok) {
                throw new Error('Failed to fetch content');
            }
            const content = await response.json();
            return content;
        } catch (error) {
            console.error('Error fetching content:', error);
            return [];
        }
    }

    function renderSentences(content) {
        if (content.length > 0) {
            const dailyContent = content[0]; // For now, just use the first item
            sourceTitle.textContent = `'${dailyContent.title}'`;
            sentencesContainer.innerHTML = ''; // Clear existing sentences

            dailyContent.sentences.forEach(sentence => {
                const sentenceEl = document.createElement('div');
                sentenceEl.className = 'flex flex-col gap-3 rounded-lg bg-[#1C2327] p-4';

                let translationsHTML = '';
                if(sentence.pt && sentence.fr && sentence.es) {
                    translationsHTML = `
                        <div class="absolute left-0 top-full mt-2 hidden rounded-md bg-[#283339] p-2 text-sm text-white/90 group-focus-within:block">
                            <p>${sentence.pt} (PT)</p>
                            <p>${sentence.fr} (FR)</p>
                            <p>${sentence.es} (ES)</p>
                        </div>
                    `;
                }

                sentenceEl.innerHTML = `
                    <div class="flex items-center gap-4">
                        <button class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--primary-color)] text-white">
                            <span class="material-symbols-outlined text-3xl">play_arrow</span>
                        </button>
                        <div class="flex-1">
                            <p class="font-['Newsreader'] text-xl text-white">${sentence.pl}</p>
                        </div>
                    </div>
                    <div>
                        <p class="text-base text-white/70">${sentence.en}</p>
                        <div class="group relative">
                            <button class="mt-2 text-sm text-[var(--primary-color)]">Show translations</button>
                            ${translationsHTML}
                        </div>
                    </div>
                `;
                sentencesContainer.appendChild(sentenceEl);

                const playButton = sentenceEl.querySelector('button');
                playButton.addEventListener('click', () => {
                    console.log(`Playing audio for: ${sentence.pl}`);
                    // Here you would implement the actual audio playback
                });

                const showTranslationsButton = sentenceEl.querySelector('.group.relative button');
                const translationsContainer = sentenceEl.querySelector('.group.relative div');
                if(showTranslationsButton && translationsContainer) {
                    showTranslationsButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        translationsContainer.classList.toggle('hidden');
                    });
                }
            });
        }
    }

    async function init() {
        const content = await fetchContent();
        renderSentences(content);
    }

    init();
});
