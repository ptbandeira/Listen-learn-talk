import { API_URL } from './config.js';

export async function initContent() {
    const hash = window.location.hash;
    const id = new URLSearchParams(hash.substring(hash.indexOf('?'))).get('id');

    if (id) {
        try {
            const response = await fetch(`${API_URL}/content/${id}`);
            if (response.ok) {
                const data = await response.json();
                displayContent(data);
                setupWordSelection();
            } else {
                console.error('Error fetching content:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    }
}

function displayContent(data) {
    const contentDetails = document.getElementById('content-details');
    if (contentDetails) {
        contentDetails.innerHTML = `
            <h1 class="text-3xl font-bold mb-4">${data.title}</h1>
            <div class="mb-8">
                <h2 class="text-2xl font-semibold mb-2">Summary</h2>
                <div id="summary-text">${data.summary}</div>
            </div>
            <div class="mb-8">
                <h2 class="text-2xl font-semibold mb-2">Vocabulary</h2>
                <ul class="list-disc ml-6">
                    ${data.vocabulary.map(item => `<li>${item.pl} - ${item.en}</li>`).join('')}
                </ul>
            </div>
            <div class="mb-8">
                <h2 class="text-2xl font-semibold mb-2">Flashcards</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${data.flashcards.map(flashcard => `
                        <div class="p-4 border rounded-lg">
                            <p>${flashcard.polish}</p>
                            <p>${flashcard.english}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="mb-8">
                <h2 class="text-2xl font-semibold mb-2">Sentences</h2>
                <ul class="list-disc ml-6">
                    ${data.sentences.map(sentence => `<li>${sentence.pl} - ${sentence.en}</li>`).join('')}
                </ul>
            </div>
            <div class="mb-8">
                <h2 class="text-2xl font-semibold mb-2">Dialogues</h2>
                ${data.dialogues.map(dialogue => `
                    <div class="mb-4">
                        <h3 class="text-xl font-semibold">${dialogue.title}</h3>
                        ${dialogue.conversation.map(line => `<p><strong>${line.character}:</strong> ${line.line}</p>`).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }
}

function setupWordSelection() {
    const summaryText = document.getElementById('summary-text');
    if (summaryText) {
        summaryText.addEventListener('mouseup', (event) => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();

            const existingPopup = document.getElementById('word-popup');
            if (existingPopup) {
                existingPopup.remove();
            }

            if (selectedText.length > 0 && selectedText.split(' ').length === 1) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                const popup = document.createElement('div');
                popup.id = 'word-popup';
                popup.className = 'absolute bg-white border rounded-lg shadow-lg p-2 flex items-center space-x-2';
                popup.style.left = `${event.pageX}px`;
                popup.style.top = `${event.pageY + 10}px`;

                const addButton = document.createElement('button');
                addButton.className = 'bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm';
                addButton.textContent = 'Add to Wordbook';
                
                popup.appendChild(addButton);
                document.body.appendChild(popup);

                addButton.addEventListener('click', async () => {
                    await addWordToWordbook(selectedText);
                    popup.remove();
                });

                document.addEventListener('mousedown', (e) => {
                    if (!popup.contains(e.target)) {
                        popup.remove();
                    }
                }, { once: true });
            }
        });
    }
}

async function addWordToWordbook(word) {
    try {
        const response = await fetch(`${API_URL}/wordbook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word: { pl: word, en: '' } })
        });
        if (response.ok) {
            console.log(`'${word}' added to wordbook.`);
        } else {
            const result = await response.json();
            console.error('Error adding word:', result.message);
        }
    } catch (error) {
        console.error('Error adding word to wordbook:', error);
    }
}
