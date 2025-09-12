document.addEventListener('DOMContentLoaded', () => {
    const scenariosContainer = document.querySelector('.flex.overflow-x-auto');
    const startButton = document.querySelector('.flex.min-w-\\[84px\\].max-w-\\[480px\\]');
    const viewTranscriptButton = document.querySelector('a[href="#"]'); // This needs to be more specific
    const viewTranslationsButton = document.querySelectorAll('a[href="#"]')[1]; // This needs to be more specific

    let dialogues = [];
    let selectedDialogue = null;

    async function fetchDialogues() {
        try {
            const response = await fetch('data/dialogues.json');
            if (!response.ok) {
                throw new Error('Failed to fetch dialogues.json');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching dialogues:', error);
            return [];
        }
    }

    function renderScenarios(dialogues) {
        scenariosContainer.innerHTML = '';
        dialogues.forEach((dialogue, index) => {
            const scenarioEl = document.createElement('div');
            scenarioEl.className = 'flex flex-col gap-3 rounded-xl min-w-48 flex-shrink-0';
            scenarioEl.innerHTML = `
                <div class="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg">
                    <div class="absolute inset-0 bg-center bg-no-repeat bg-cover" style='background-image: url("${dialogue.image}");'></div>
                    <div class="absolute inset-0 bg-black/20"></div>
                </div>
                <div>
                    <p class="text-white text-base font-bold leading-normal">${dialogue.title}</p>
                    <p class="text-[#9eb7a8] text-sm font-normal leading-normal">${dialogue.description}</p>
                </div>
            `;
            scenarioEl.addEventListener('click', () => {
                selectedDialogue = dialogue;
                // Add a visual indicator for the selected dialogue
                document.querySelectorAll('.min-w-48').forEach(el => el.classList.remove('border-2', 'border-[var(--primary-color)]'));
                scenarioEl.classList.add('border-2', 'border-[var(--primary-color)]');
            });
            scenariosContainer.appendChild(scenarioEl);

            if(index === 0) {
                scenarioEl.click();
            }
        });
    }

    startButton.addEventListener('click', () => {
        if (selectedDialogue) {
            alert('Audio recording is not available in this environment. This is a placeholder for the recording functionality.');
        } else {
            alert('Please select a dialogue scenario first.');
        }
    });

    viewTranscriptButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (selectedDialogue) {
            let transcript = selectedDialogue.transcript.map(line => `${line.speaker}: ${line.line_pl}`).join('\n');
            alert(`Transcript:\n\n${transcript}`);
        } else {
            alert('Please select a dialogue scenario first.');
        }
    });

    viewTranslationsButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (selectedDialogue) {
            let translations = selectedDialogue.transcript.map(line => `${line.speaker}: ${line.line_en}`).join('\n');
            alert(`Translations:\n\n${translations}`);
        } else {
            alert('Please select a dialogue scenario first.');
        }
    });

    async function init() {
        dialogues = await fetchDialogues();
        renderScenarios(dialogues);
    }

    init();
});
