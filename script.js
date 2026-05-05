// Purpose: legacy loader for structured JS files. Callers: old HTML references. Deps: js/*.js. API: none. Side effects: loads app scripts.
[
  'js/data.js',
  'js/ui.js',
  'js/cart.js',
  'js/audio.js',
  'js/pages.js',
  'js/navigation.js',
  'js/main.js',
].forEach(src => document.write(`<script src="${src}"><\/script>`));
