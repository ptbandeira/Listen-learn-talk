document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');

    const routes = {
        '#home': 'views/home.html',
        '#flashcards': 'views/flashcards.html',
        '#sentences': 'views/contextual_sentences.html',
        '#dialogues': 'views/dialogues.html',
        '#wordbook': 'views/wordbook.html',
        '#goals': 'views/goals.html'
    };

    const scripts = {
        '#home': 'js/home.js',
        '#flashcards': 'js/flashcards.js',
        '#sentences': 'js/sentences.js',
        '#dialogues': 'js/dialogues.js',
        '#wordbook': 'js/wordbook.js',
        '#goals': 'js/goals.js'
    }

    async function loadView(view) {
        try {
            const response = await fetch(view);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${view}: ${response.statusText}`);
            }
            const html = await response.text();
            content.innerHTML = html;
        } catch (error) {
            console.error('Error loading view:', error);
            content.innerHTML = `<div class="p-4"><p class="text-red-500">Error loading page. Please try again.</p></div>`;
        }
    }

    function loadScript(scriptPath) {
        // Remove existing script to avoid re-execution issues
        const oldScript = document.getElementById('view-script');
        if (oldScript) {
            oldScript.remove();
        }

        const script = document.createElement('script');
        script.id = 'view-script';
        script.src = scriptPath;
        script.defer = true;
        document.body.appendChild(script);
    }

    function router() {
        const hash = window.location.hash || '#home';
        const view = routes[hash];
        const script = scripts[hash];

        if (view) {
            loadView(view).then(() => {
                if (script) {
                    loadScript(script);
                }
                updateNav(hash);
            });
        } else {
            // Handle 404 Not Found
            content.innerHTML = `<div class="p-4"><h2>404 - Page Not Found</h2></div>`;
        }
    }

    function updateNav(hash) {
        const navLinks = document.querySelectorAll('footer nav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === hash) {
                link.classList.add('text-[var(--primary-color)]');
                link.classList.remove('text-gray-500');
            } else {
                link.classList.add('text-gray-500');
                link.classList.remove('text-[var(--primary-color)]');
            }
        });
    }

    window.addEventListener('hashchange', router);

    // Initial load
    router();
});
