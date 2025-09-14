import { initHome } from './home.js';

const routes = {
  '#home': {
    template: 'views/home.html',
    init: initHome,
  },
  // Other routes will be added here later
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
