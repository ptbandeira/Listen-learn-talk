import { API_URL } from './config.js';

export function initWordbook() {
    const wordbookContainer = document.getElementById('wordbook-container');
    const sentencesContainer = document.getElementById('sentences-container');
    const generateSentencesBtn = document.getElementById('generate-sentences-btn');

    async function loadWordbook() {
        try {
            const response = await fetch(`${API_URL}/my-wordbook`);
            if (response.ok) {
                const wordbook = await response.json();
                renderWordbook(wordbook);
            } else {
                console.error('Failed to load wordbook:', response.statusText);
            }
        } catch (error) {
            console.error('Error loading wordbook:', error);
        }
    }

    function renderWordbook(wordbook) {
        if (wordbookContainer) {
            if (wordbook.length === 0) {
                wordbookContainer.innerHTML = '<p>Your wordbook is empty. Add words from content pages!</p>';
                return;
            }

            wordbookContainer.innerHTML = `
                <ul class="bg-white p-6 rounded-lg shadow-lg">
                    ${wordbook.map(word => `<li class="flex justify-between items-center py-2 border-b">
                        <span>${word.pl}</span>
                    </li>`).join('')}
                </ul>
            `;
        }
    }

    if (generateSentencesBtn) {
        generateSentencesBtn.addEventListener('click', async () => {
            try {
                const response = await fetch(`${API_URL}/my-wordbook`);
                if (response.ok) {
                    const wordbook = await response.json();
                    const words = wordbook.map(w => w.pl);
                    await generatePracticeSentences(words);
                } else {
                    console.error('Failed to get wordbook for sentence generation:', response.statusText);
                }
            } catch (error) {
                console.error('Error getting wordbook:', error);
            }
        });
    }

    async function generatePracticeSentences(words) {
        if (words.length === 0) {
            alert('Your wordbook is empty!');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/generate-practice-sentences`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ words })
            });

            if (response.ok) {
                const result = await response.json();
                renderSentences(result.sentences);
            } else {
                const error = await response.json();
                console.error('Failed to generate sentences:', error.message);
                alert('Failed to generate sentences.');
            }
        } catch (error) {
            console.error('Error generating sentences:', error);
        }
    }

    function renderSentences(sentences) {
        if (sentencesContainer) {
            sentencesContainer.innerHTML = `
                <h3 class="text-xl font-bold mb-4 mt-8">Practice Sentences</h3>
                <ul class="bg-white p-6 rounded-lg shadow-lg">
                    ${sentences.map(s => `<li class="py-2 border-b">${s.pl} - ${s.en}</li>`).join('')}
                </ul>
            `;
        }
    }

    loadWordbook();
}
