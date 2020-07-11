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
        if (i === path.length - 1) {
          return cursor[m];
        } else {
          throw `not a directory: ${m}`;
        }
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
