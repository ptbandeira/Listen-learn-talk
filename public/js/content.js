export function initContent() {
    const contentId = new URLSearchParams(window.location.search).get('id');
    if (contentId) {
        fetch(`/api/content/${contentId}`)
            .then(response => response.json())
            .then(data => {
                displayContent(data);
            })
            .catch(error => console.error('Error fetching content:', error));
    }
}

function displayContent(data) {
    const contentDiv = document.getElementById('content-details');
    // Clear existing content
    contentDiv.innerHTML = '';

    // Title
    const title = document.createElement('h1');
    title.textContent = data.title;
    contentDiv.appendChild(title);

    // Summary
    const summary = document.createElement('p');
    summary.textContent = data.summary;
    contentDiv.appendChild(summary);

    // Vocabulary
    const vocabulary = document.createElement('div');
    vocabulary.innerHTML = '<h2>Vocabulary</h2>';
    data.vocabulary.forEach(item => {
        const p = document.createElement('p');
        p.textContent = `${item.pl} - ${item.en}`;
        vocabulary.appendChild(p);
    });
    contentDiv.appendChild(vocabulary);

    // Flashcards
    const flashcards = document.createElement('div');
    flashcards.innerHTML = '<h2>Flashcards</h2>';
    data.flashcards.forEach(item => {
        const p = document.createElement('p');
        p.textContent = `${item.polish} - ${item.english}`;
        flashcards.appendChild(p);
    });
    contentDiv.appendChild(flashcards);

    // Sentences
    const sentences = document.createElement('div');
    sentences.innerHTML = '<h2>Sentences</h2>';
    data.sentences.forEach(item => {
        const p = document.createElement('p');
        p.textContent = `${item.pl} - ${item.en}`;
        sentences.appendChild(p);
    });
    contentDiv.appendChild(sentences);

    // Dialogues
    const dialogues = document.createElement('div');
    dialogues.innerHTML = '<h2>Dialogues</h2>';
    data.dialogues.forEach(dialogue => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${dialogue.title}</strong>`;
        dialogue.conversation.forEach(line => {
            p.innerHTML += `<br><strong>${line.character}:</strong> ${line.line}`;
        });
        dialogues.appendChild(p);
    });
    contentDiv.appendChild(dialogues);
}
