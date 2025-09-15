import { fetchData } from './utils.js';
import { API_URL } from './config.js';

export function initDialogues() {
    const dialogueContainer = document.getElementById('dialogue-container');
    const newDialogueBtn = document.getElementById('new-dialogue-btn');

    let dialogues = [];
    let currentDialogue = 0;

    async function loadDialogues() {
        dialogues = await fetchData(`${API_URL}/dialogues`);
        renderDialogue();
    }

    function renderDialogue() {
        if (!dialogueContainer) return;
        if (currentDialogue >= dialogues.length) {
            dialogueContainer.innerHTML = '<p>No more dialogues!</p>';
            return;
        }

        const dialogue = dialogues[currentDialogue];
        dialogueContainer.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <h3 class="text-xl font-bold mb-4">${dialogue.title}</h3>
                <ul>
                    ${dialogue.conversation.map(line => `<li><strong>${line.speaker}:</strong> ${line.line}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    if (newDialogueBtn) {
        newDialogueBtn.addEventListener('click', () => {
            currentDialogue++;
            renderDialogue();
        });
    }

    loadDialogues();
}
