// LocalStorage Interaction Functions
function readLinks() {
  return safeParse(localStorage.getItem(LS_KEY));
}

function writeLinks() {
  localStorage.setItem(LS_KEY, JSON.stringify(links));
}

function readTheme() {
  return localStorage.getItem(LS_THEME_KEY);
}

function writeTheme(theme) {
  localStorage.setItem(LS_THEME_KEY, theme);
}

function readEngine() {
  return localStorage.getItem(LS_ENGINE_KEY);
}

function writeEngine(url) {
  localStorage.setItem(LS_ENGINE_KEY, url);
}