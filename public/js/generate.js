import { API_HOST, fetchData } from './utils.js';

export function initGenerate() {
    const generateBtn = document.getElementById('generate-btn');
    const contentUrl = document.getElementById('content-url');
    const generateTextBtn = document.getElementById('generate-text-btn');
    const articleText = document.getElementById('article-text');

    const generateContent = async (data) => {
        try {
            const result = await fetchData(`${API_HOST}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            window.location.hash = `#content?id=${result.data.id}`;
        } catch (error) {
            console.error('Error generating content:', error);
            alert('Failed to generate content.');
        }
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
