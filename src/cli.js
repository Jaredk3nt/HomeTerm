// Global data
let searchUrl = ENGINES.google;
let promptSymbol = "$"; // Update to change prompt
let links = {};
let position = []; // Determines where in the link tree we are currently
let commandHistory = [];
let commandHistoryCursor = -1;
let autoCompleteHistory = [];
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
  if (e.keyCode === 9) {
    // Tab
    e.preventDefault();
    e.stopPropagation();
    handleAutoComplete();
  }
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
