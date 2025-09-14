import { fetchData } from './utils.js';

let dialogues = [];
let currentDialogueIndex = 0;

async function initDialogues() {
    const dialogueContainer = document.getElementById('dialogue-container');
    const nextBtn = document.getElementById('next-dialogue-btn');

    try {
        dialogues = await fetchData('/api/dialogues');
        if (dialogues.length > 0) {
            displayDialogue();
        } else {
            dialogueContainer.innerHTML = '<p>No dialogues available.</p>';
        }
    } catch (error) {
        console.error('Error fetching dialogues:', error);
        dialogueContainer.innerHTML = '<p>Error loading dialogues.</p>';
    }

    nextBtn.addEventListener('click', () => {
        currentDialogueIndex = (currentDialogueIndex + 1) % dialogues.length;
        displayDialogue();
    });
}

function displayDialogue() {
    const dialogue = dialogues[currentDialogueIndex];
    const dialogueContainer = document.getElementById('dialogue-container');

    const dialogueHTML = `
        <div class="mb-4">
            <audio controls class="w-full">
                <source src="${dialogue.audio_file}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        </div>
        <div>
            ${dialogue.conversation.map(line => `<p><span class="font-bold">${line.speaker}:</span> ${line.line}</p>`).join('')}
        </div>
    `;

    dialogueContainer.innerHTML = dialogueHTML;
}

export { initDialogues };