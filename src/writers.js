function listWriter(output) {
  if (Array.isArray(output)) {
    const terminal = document.getElementById("terminal-content");
    const outputNode = document.createElement("div");
    outputNode.classList.add("terminal-output");
    let inner = "<ul class='ls-list'>";
    inner =
      inner +
      output
        .map((item) => `<li class='ls-item ${item.type}'>${item.key}</li>`)
        .join("");
    inner = inner + "</ul>";
    outputNode.innerHTML = inner;
    terminal.appendChild(outputNode);
  } else {
    textWriter(output);
  }
}

function textWriter(output = "") {
  const terminal = document.getElementById("terminal-content");
  const outputNode = document.createElement("div");
  outputNode.classList.add("terminal-output");
  const textNode = document.createElement("p");
  textNode.innerText = output;
  outputNode.appendChild(textNode);
  terminal.appendChild(outputNode);
}

function ulWriter(output = '') {
  // TODO: simplify these cases together
  if (Array.isArray(output)) {
    // Simple ul
    const terminal = document.getElementById("terminal-content");
    const outputNode = document.createElement("div");
    outputNode.classList.add("terminal-output");
    let inner = "<ul class='default-list'>";
    inner =
      inner +
      output
        .map((item) => `<li class='default-list-item'>${item}</li>`)
        .join("");
    inner = inner + "</ul>";
    outputNode.innerHTML = inner;
    terminal.appendChild(outputNode);
  } else if (output.title && output.items) {
    // Ul with title
    const terminal = document.getElementById("terminal-content");
    const outputNode = document.createElement("div");
    outputNode.classList.add("terminal-output");
    let inner = `<p class='default-list-title'>${output.title}</p><ul class='default-list'>`;
    inner =
      inner +
      output.items
        .map((item) => `<li class='default-list-item'>${item}</li>`)
        .join("");
    inner = inner + "</ul>";
    outputNode.innerHTML = inner;
    terminal.appendChild(outputNode);
  } else {
    textWriter(output);
  }
}
