function safeParse(input) {
  try {
    return JSON.parse(input) || {};
  } catch {
    return {};
  }
}

function locationType(val) {
  if (typeof val === "string") return types.LINK;
  return types.DIR;
}

function joinWriter(command, writer) {
  return (input) => {
    writer(command(input));
  };
}

function focusPrompt() {
  document.getElementById("prompt-input").focus();
}

function getCursor(pos) {
  let cursor = links;
  pos.forEach((p) => {
    // TODO: handle bad positions
    cursor = cursor[p];
  });
  return cursor;
}

function getCurrentCursor() {
  return getCursor(position);
}

function pushCommand(cmd) {
  const prompt = document.getElementById("prompt-input");
  prompt.value = cmd;
  focusPrompt();
}

// Returns link url if link or cursor if directory
// Throw error if bad path
function locatePath(path) {
  let cursor = locateParentPath(path);
  if (path.length) {
    const final = path[path.length - 1];
    if (!cursor[final]) {
      throw `no such link or directory: ${final}`;
    }
    return cursor[final];
  }
  return cursor;
}

function locateParentPath(fullPath) {
  const path = fullPath.slice(0, fullPath.length - 1);
  let cursor = getCurrentCursor();
  const newPosition = [...position];
  for (let i = 0; i < path.length; i++) {
    const m = path[i];
    if (m === "..") {
      newPosition.pop();
      cursor = getCursor(newPosition);
    } else {
      if (!cursor[m]) {
        throw `no such link or directory: ${m}`;
      }
      if (locationType(cursor[m]) === types.LINK) {
        throw `not a directory: ${m}`;
      }
      newPosition.push(m);
      cursor = getCursor(newPosition);
    }
  }
  return cursor;
}

// Write out functions
function writePrompt() {
  const terminal = document.getElementById("terminal-content");
  const prompt = document.createElement("div");
  prompt.classList.add("prompt");
  prompt.innerHTML = `
  <p class='prompt-title'>~${position.length ? "/" : ""}${position.join(
    "/"
  )}<span class='prompt-cursor'>${promptSymbol}</span></p>
  <input id='prompt-input' type='text' />
  `;
  terminal.appendChild(prompt);
}

function replacePrompt() {
  const oldPrompt = document.getElementById("prompt-input");
  const value = oldPrompt.value;
  const promptText = document.createElement("p");
  promptText.innerText = value;
  promptText.classList.add("prompt-text");
  oldPrompt.replaceWith(promptText);
  writePrompt();
}

// Parse command input by keeping strings in "" together as an single item
function parseCommand(input) {
  const re = /"([^"]+)"|([^\s]+)/g;
  const parsedCmd = [];
  let temp;
  while ((temp = re.exec(input)) !== null) {
    const val = temp[1] || temp[2]; // Get the correct capture group
    parsedCmd.push(val);
  }
  return parsedCmd;
}

// Parse command array to extract flags
function extractFlags(command, flagMap = {}) {
  const finalCommand = [];
  const flags = {};
  for (let i = 0; i < command.length; i++) {
    const arg = command[i];
    const isFlag = /^(-|--)(\w+)/.exec(arg);
    if (isFlag) {
      const flag = isFlag[2];
      // If flag marked boolean, don't capture input
      // TODO: throw error if not found in map?
      if (flagMap[flag] !== "boolean") {
        flags[flag] = command[i + 1];
        i++;
      } else {
        flags[flag] = true;
      }
    } else {
      finalCommand.push(arg);
    }
  }

  return { command: finalCommand, flags };
}

function formatUrl(url) {
  let finalUrl = url;
  if (!/^http|https:\/\//.test(finalUrl)) {
    finalUrl = "https://" + finalUrl;
  }
  return finalUrl;
}

function removeTempOutput() {
  const tempNode = document.getElementById(TEMP_NODE_ID);
  if (tempNode) {
    tempNode.remove();
  }
}

function handleAutoComplete() {
  const input = document.getElementById("prompt-input");
  const parsedInput = parseCommand(input.value);
  let currentLocation = COMMAND_TREE;
  let possibleChoices = [];
  for (let i = 0; i < parsedInput.length; i++) {
    const current = parsedInput[i];
    // Simple case, we have already found where we are supposed to be
    if (currentLocation[current]) {
      currentLocation = currentLocation[current];
    }
    // Unfinished case
    possibleChoices.push(
      ...Object.keys(currentLocation)
        .filter((item) => item.startsWith(current))
        .map((item) => ({
          choice: item,
          replace: item.slice(current.length, item.length),
        }))
    );
    if (possibleChoices.length) break;
  }

  // TODO: remove flags from parsed input
  // TODO: determine what each piece is. Is it a command (or partial), if not is it a PATH, if not assume RAW. If empty do nothing
  // TODO: find current pos in tree
  // TODO: use tree and current pos to determine possible next options
  // TODO: use next option to fill input if possible
  // TODO: allow tab to cycle through options if no typing has been made since last tab
  if (!possibleChoices || !possibleChoices.length) {
    return;
  } else if (possibleChoices.length == 1) {
    return (input.value = input.value + possibleChoices[0].replace);
  } else {
    // TODO: save state to replace later on
    return listWriter(
      possibleChoices.map(({ choice }) => choice),
      { id: TEMP_NODE_ID }
    );
  }
}
