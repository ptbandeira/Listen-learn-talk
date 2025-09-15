document.addEventListener('DOMContentLoaded', () => {
    const goalTypeSelect = document.getElementById('goal-type');
    const goalNumberInput = document.getElementById('goal-value');
    const goalFrequencySelect = document.getElementById('goal-frequency');
    const saveGoalsButton = document.querySelector('.w-full.rounded-lg');
    const activeGoalsContainer = document.querySelector('.space-y-4.mt-4');

    let goals = JSON.parse(localStorage.getItem('goals')) || [];

    function renderActiveGoals() {
        activeGoalsContainer.innerHTML = '';
        goals.forEach((goal, index) => {
            const goalEl = document.createElement('div');
            goalEl.className = 'bg-[#283039] p-4 rounded-lg';
            // A simple progress simulation
            const progress = Math.min(100, (JSON.parse(localStorage.getItem('learnedWords'))?.length || 0) / goal.number * 100);

            goalEl.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-bold">${goal.type} ${goal.number} ${goal.frequency}</p>
                        <p class="text-sm text-gray-400">Progress: ${Math.floor(progress / 10)}/${goal.number}</p>
                    </div>
                    <button class="p-1 text-gray-400 hover:text-white" data-index="${index}">
                        <span class="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
                <div class="w-full bg-gray-600 rounded-full h-2.5 mt-2">
                    <div class="bg-[var(--primary-color)] h-2.5 rounded-full" style="width: ${progress}%"></div>
                </div>
            `;
            activeGoalsContainer.appendChild(goalEl);

            const deleteButton = goalEl.querySelector('button');
            deleteButton.addEventListener('click', () => {
                goals.splice(index, 1);
                localStorage.setItem('goals', JSON.stringify(goals));
                renderActiveGoals();
            });
        });
    }

    saveGoalsButton.addEventListener('click', () => {
        const newGoal = {
            type: goalTypeSelect.value,
            number: goalNumberInput.value,
            frequency: goalFrequencySelect.value
        };

        if (newGoal.number > 0) {
            goals.push(newGoal);
            localStorage.setItem('goals', JSON.stringify(goals));
            renderActiveGoals();
            goalNumberInput.value = '';
        } else {
            alert('Please enter a valid number for the goal.');
        }
    });

    function init() {
        renderActiveGoals();
    }

    init();
});
