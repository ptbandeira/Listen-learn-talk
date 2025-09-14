import { initHome } from './home.js';
import { initFlashcards } from './flashcards.js';
import { initSentences } from './sentences.js';
import { initDialogues } from './dialogues.js';
import { initWordbook } from './wordbook.js';

const routes = {
  '#home': { template: 'views/home.html', init: initHome },
  '#flashcards': { template: 'views/flashcards.html', init: initFlashcards },
  '#sentences': { template: 'views/sentences.html', init: initSentences },
  '#dialogues': { template: 'views/dialogues.html', init: initDialogues },
  '#wordbook': { template: 'views/wordbook.html', init: initWordbook },
};

const content = document.getElementById('content');

async function router() {
  const hash = window.location.hash || '#home';
  const route = routes[hash];

  if (route && route.template) {
    const response = await fetch(route.template);
    content.innerHTML = await response.text();
    if (route.init) {
      route.init();
    }
    updateNavLinks(hash);
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
