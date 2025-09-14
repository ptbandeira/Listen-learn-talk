import { initHome } from './home.js';
// Import other page initialization functions as they are created
// import { initFlashcards } from './flashcards.js';
// import { initSentences } from './sentences.js';
// import { initDialogues } from './dialogues.js';
// import { initWordbook } from './wordbook.js';

const routes = {
  '#home': {
    path: '/',
    template: 'templates/home.html',
    init: initHome,
  },
  '#flashcards': {
    path: '/flashcards',
    template: 'templates/flashcards.html',
    // init: initFlashcards,
  },
  '#sentences': {
    path: '/sentences',
    template: 'templates/sentences.html',
    // init: initSentences,
  },
  '#dialogues': {
    path: '/dialogues',
    template: 'templates/dialogues.html',
    // init: initDialogues,
  },
  '#wordbook': {
    path: '/wordbook',
    template: 'templates/wordbook.html',
    // init: initWordbook,
  },
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
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
