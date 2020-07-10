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
