import { API_URL } from './config.js';

export function initTutor() {
    const chatContainer = document.getElementById('chat-container');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    let conversationHistory = [];

    function loadConversation() {
        const savedHistory = localStorage.getItem('tutorConversation');
        if (savedHistory) {
            conversationHistory = JSON.parse(savedHistory);
            conversationHistory.forEach(message => {
                displayMessage(message.content, message.role);
            });
        }
    }

    function saveConversation() {
        localStorage.setItem('tutorConversation', JSON.stringify(conversationHistory));
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (message.length === 0) return;

        displayMessage(message, 'user');
        conversationHistory.push({ role: 'user', content: message });
        saveConversation();
        chatInput.value = '';

        try {
            const response = await fetch(`${API_URL}/tutor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: conversationHistory })
            });

            if (response.ok) {
                const result = await response.json();
                displayMessage(result.reply, 'ai');
                conversationHistory.push({ role: 'assistant', content: result.reply });
                saveConversation();
            } else {
                const error = await response.json();
                displayMessage(`Error: ${error.message}`, 'ai');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            displayMessage('Error sending message. Please try again.', 'ai');
        }
    }

    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `p-2 my-2 rounded-lg ${sender === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-200'}`;
        messageElement.textContent = message;
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    loadConversation();
}
