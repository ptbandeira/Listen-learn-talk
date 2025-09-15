export function initGenerate() {
    const generateBtn = document.getElementById('generate-btn');
    const contentUrl = document.getElementById('content-url');

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const url = contentUrl.value;
            if (url) {
                try {
                    const response = await fetch('http://localhost:8000/api/generate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ url })
                    });
                    const result = await response.json();
                    alert(result.message);
                } catch (error) {
                    console.error('Error generating content:', error);
                    alert('Failed to generate content.');
                }
            }
        });
    }
}
