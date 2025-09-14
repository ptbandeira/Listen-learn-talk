import { fetchData } from '../utils.js';

async function initHome() {
  const contentSection = document.getElementById('content-section');

  try {
    const data = await fetchData('http://localhost:3000/api/content');
    if (data.content) {
      displayContent(data.content, contentSection);
    } else {
      contentSection.innerHTML = '<p>No content available. Click the button to generate new content.</p>';
    }
  } catch (error) {
    console.error('Error fetching content:', error);
    contentSection.innerHTML = '<p>Error loading content. Please try again later.</p>';
  }

  const generateButton = document.getElementById('generate-btn');
  generateButton.addEventListener('click', async () => {
    try {
      const newData = await fetchData('http://localhost:3000/api/generate-content', { method: 'POST' });
      displayContent(newData.content, contentSection);
    } catch (error) {
      console.error('Error generating content:', error);
      contentSection.innerHTML = '<p>Error generating content. Please try again later.</p>';
    }
  });
}

function displayContent(content, container) {
  container.innerHTML = `
    <div class="polish-phrase">
      <h3>${content.polish_text}</h3>
      <p>${content.english_text}</p>
    </div>
  `;
}

export { initHome };
