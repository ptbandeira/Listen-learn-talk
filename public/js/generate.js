import { API_URL } from './config.js';

export function initGenerate() {
    const generateBtn = document.getElementById('generate-btn');
    const contentUrl = document.getElementById('content-url');
    const generateTextBtn = document.getElementById('generate-text-btn');
    const articleText = document.getElementById('article-text');

    const generateContent = async (data) => {
        try {
            const response = await fetch(`${API_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.ok) {
                displayGeneratedContent(result.data);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error generating content:', error);
            alert('Failed to generate content.');
        }
    };

    const displayGeneratedContent = (data) => {
        const generatedContent = document.getElementById('generated-content');
        generatedContent.style.display = 'block';

        document.getElementById('summary-text').textContent = data.summary;

        const vocabularyList = document.getElementById('vocabulary-list');
        vocabularyList.innerHTML = '';
        data.vocabulary.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.pl} - ${item.en}`;
            vocabularyList.appendChild(li);
        });

        const flashcardsContainer = document.getElementById('flashcards-container');
        flashcardsContainer.innerHTML = '';
        data.flashcards.forEach(flashcard => {
            const card = document.createElement('div');
            card.className = 'p-4 border rounded-lg';
            card.innerHTML = `<p>${flashcard.polish}</p><p>${flashcard.english}</p>`;
            flashcardsContainer.appendChild(card);
        });

        const sentencesList = document.getElementById('sentences-list');
        sentencesList.innerHTML = '';
        data.sentences.forEach(sentence => {
            const li = document.createElement('li');
            li.textContent = `${sentence.pl} - ${sentence.en}`;
            sentencesList.appendChild(li);
        });

        const dialoguesContainer = document.getElementById('dialogues-container');
        dialoguesContainer.innerHTML = '';
        data.dialogues.forEach(dialogue => {
            const dialogueDiv = document.createElement('div');
            dialogueDiv.className = 'mb-4';
            dialogueDiv.innerHTML = `<h6>${dialogue.title}</h6>`;
            dialogue.conversation.forEach(line => {
                dialogueDiv.innerHTML += `<p><strong>${line.character}:</strong> ${line.line}</p>`;
            });
            dialoguesContainer.appendChild(dialogueDiv);
        });
    };

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const url = contentUrl.value;
            if (url) {
                generateContent({ url });
            }
        });
    }

    if (generateTextBtn) {
        generateTextBtn.addEventListener('click', () => {
            const text = articleText.value;
            if (text) {
                generateContent({ text });
            }
        });
    }
}
