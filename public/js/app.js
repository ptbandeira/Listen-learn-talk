import { initHome } from './home.js';
import { initFlashcards } from './flashcards.js';
import { initSentences } from './sentences.js';
import { initDialogues } from './dialogues.js';
import { initWordbook } from './wordbook.js';
import { initGenerate } from './generate.js';

const routes = {
  '#home': { template: 'views/home.html', init: initHome },
  '#flashcards': { template: 'views/flashcards.html', init: initFlashcards },
  '#sentences': { template: 'views/sentences.html', init: initSentences },
  '#dialogues': { template: 'views/dialogues.html', init: initDialogues },
  '#wordbook': { template: 'views/wordbook.html', init: initWordbook },
  '#generate': { template: 'views/generate.html', init: initGenerate },
};

const content = document.getElementById('content');

async function router() {
  console.log("Router function called");
  const hash = window.location.hash || '#home';
  console.log("Current hash:", hash);
  const route = routes[hash];
  console.log("Route object:", route);

  if (route && route.template) {
    try {
      const response = await fetch(route.template);
      console.log("Template fetched:", route.template);
      if (!response.ok) {
        console.error("Failed to fetch template:", response.status, response.statusText);
        content.innerHTML = `<p>Error loading page content.</p>`;
        return;
      }
      const html = await response.text();
      content.innerHTML = html;
      console.log("Template loaded into content div");
      if (route.init) {
        console.log("Initializing component");
        await route.init();
      }
      updateNavLinks(hash);
    } catch (error) {
        console.error("Error in router:", error);
        content.innerHTML = `<p>An unexpected error occurred.</p>`;
    }
  } else {
    console.log("No route found for hash:", hash);
  }
}

function updateNavLinks(hash) {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === hash) {
      link.classList.add('text-[var(--primary-color)]');
      link.classList.remove('text-gray-500', 'hover:text-[var(--primary-color)]');
    } else {
      link.classList.remove('text-[var(--primary-color)]');
      link.classList.add('text-gray-500', 'hover:text-[var(--primary-color)]');
    }
  });
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
