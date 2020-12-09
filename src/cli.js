// Defined Commands
const COMMANDS = {
  ls: { func: joinWriter(list, treeWriter), help: "usage: ls [<path to dir>]" },
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
    help: 'usage: search [-e] "<search string>"',
  },
  tree: {
    func: joinWriter(tree, treeWriter),
    help: "usage: tree",
  },
  mv: {
    func: joinWriter(mv, textWriter),
    help: "usage: mv <source path> <target path>",
  },
  edit: {
    func: joinWriter(edit, textWriter),
    help: "usage: edit <link path> <url>",
  },
};

// Global data
let searchUrl = ENGINES.google;
let promptSymbol = "$"; // Update to change prompt
let links = {};
let position = []; // Determines where in the link tree we are currently
let commandHistory = [];
let commandHistoryCursor = -1;
// IIFE for setup
(() => {
  const lsLinks = readLinks();
  if (lsLinks) {
    links = lsLinks;
  }
  // Set Engine
  const savedEngine = readEngine();
  if (savedEngine) {
    searchUrl = savedEngine;
  }
  // Set theme
  const currentTheme = readTheme();
  theme([currentTheme]);
  // write initial prompt
  const d = new Date();
  const [date, time] = d.toLocaleString().split(" ");
  textWriter(
    `It's ${time.slice(0, time.length - 3)} on ${date.replace(",", "")}.`
  );
  writePrompt();
  // Setup event listener for commands
  document.addEventListener("keydown", handleKeyPresses);
  focusPrompt();
})();

function handleKeyPresses(e) {
  switch (e.key) {
    case "Enter":
      e.preventDefault();
      const input = document.getElementById("prompt-input");
      return runCommand(input.value);
    case "ArrowUp":
      e.preventDefault();
      if (commandHistoryCursor === -1 && commandHistory.length) {
        commandHistoryCursor = commandHistory.length - 1;
        return pushCommand(commandHistory[commandHistoryCursor]);
      }
      if (commandHistoryCursor > 0) {
        commandHistoryCursor--;
        return pushCommand(commandHistory[commandHistoryCursor]);
      }
      break;
    case "ArrowDown":
      e.preventDefault();
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
      break;
    default:
      break;
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
