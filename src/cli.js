// Constants
const LS_KEY = "cli-page-links";
const LS_THEME_KEY = "cli-page-theme";
const types = {
  LINK: "link",
  DIR: "directory",
};
const THEMES = ["dark", "light", "laserwave", "nord", "greyscale", "dracula"];
const COMMANDS = {
  ls: { func: joinWriter(list, listWriter), help: "usage: ls [<path to dir>]" },
  cd: { func: joinWriter(cd, textWriter), help: "usage: cd [<path>]" },
  open: { func: joinWriter(openLink, textWriter), help: "usage: open <path>" },
  touch: {
    func: joinWriter(touch, textWriter),
    help: "usage: touch <path to link> <url>",
  },
  mkdir: {
    func: joinWriter(mkdir, textWriter),
    help: "usage: mkdir <path to dir>",
  },
  theme: {
    func: joinWriter(theme, ulWriter),
    help: "usage: theme <theme name>",
  },
  rm: { func: joinWriter(rm, textWriter), help: "usage: rm <link path>" },
  rmdir: {
    func: joinWriter(rmdir, textWriter),
    help: "usage: rmdir <dir path>",
  },
  clear: { func: clear, help: "usage: clear" },
  help: { func: joinWriter(help, listWriter), help: "usage: help [<command>]" },
  search: {
    func: joinWriter(search, textWriter),
    help: 'usage: search "<search string>"',
  },
};
const WEEK_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const SEARCH_URL = "https://google.com/search?q=";
// Global data
let promptSymbol = "$";
let links = {};
let position = []; // Determines where in the link tree we are currently
let commandHistory = [];
let commandHistoryCursor = -1;
// IIFE for setup
(() => {
  // writeLinks();
  const lsLinks = readLinks();
  if (lsLinks) {
    links = lsLinks;
  }
  // Set theme
  const currentTheme = readTheme();
  theme([currentTheme]);
  // write initial prompt
  const d = new Date();
  const [date, time] = d.toLocaleString().split(" ");
  textWriter(
    //`It's ${time.slice(0, time.length - 3)} on ${date.replace(",", "")}.`
    'It\'s 7:48 on 7/10/2020.'
  );
  writePrompt();
  // Setup event listener for commands
  document.addEventListener("keydown", handleKeyPresses);
  focusPrompt();
})();

function handleKeyPresses(e) {
  if (e.keyCode === 13) {
    // Enter
    const input = document.getElementById("prompt-input");
    return runCommand(input.value);
  }
  if (e.keyCode === 38) {
    // Up
    if (commandHistoryCursor === -1 && commandHistory.length) {
      commandHistoryCursor = commandHistory.length - 1;
      return pushCommand(commandHistory[commandHistoryCursor]);
    }
    if (commandHistoryCursor > 0) {
      commandHistoryCursor--;
      return pushCommand(commandHistory[commandHistoryCursor]);
    }
  }
  if (e.keyCode === 40) {
    // Down
    if (commandHistoryCursor === commandHistory.length - 1) {
      commandHistoryCursor = -1;
      return pushCommand("");
    }
    if (
      commandHistoryCursor >= 0 &&
      commandHistoryCursor < commandHistory.length
    ) {
      commandHistoryCursor++;
      return pushCommand(commandHistory[commandHistoryCursor]);
    }
  }
}

// User Commands
function runCommand(cmd) {
  commandHistory.push(cmd);
  // TODO: update parse to handle flags and quotations to better handle future commands
  const parsedCmd = parseCommand(cmd);
  let response;
  if (COMMANDS[parsedCmd[0]]) {
    if (parsedCmd.length > 1 && parsedCmd[1] === "-h") {
      response = COMMANDS.help.func([parsedCmd[0]]);
    } else {
      response = COMMANDS[parsedCmd[0]].func(
        parsedCmd.slice(1, parsedCmd.length)
      );
    }
  } else {
    textWriter("Command not found.");
  }
  if (!response) {
    replacePrompt();
  }
  focusPrompt();
}
