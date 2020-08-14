const TEMP_NODE_ID = "temp-terminal-output";

function createWriter(createInner) {
  return function (output = "", { className, id } = {}) {
    removeTempOutput();

    const terminal = document.getElementById("terminal-content");
    const outputNode = document.createElement("div");
    if (id) outputNode.setAttribute("id", id);
    outputNode.classList.add(className || "terminal-output");
    const inner = createInner(output);
    outputNode.innerHTML = inner;
    terminal.appendChild(outputNode);
  };
}

function listInner(
  output,
  { ulClassName = "ls-list", liClassName = "ls-item" } = {}
) {
  if (Array.isArray(output)) {
    let inner = `<ul class='${ulClassName}'>`;
    inner =
      inner +
      output
        .map((item) => {
          if (item.key && item.type) {
            return `<li class='${liClassName} ${item.type}'>${item.key}</li>`;
          }
          return `<li class='${liClassName}'>${item}</li>`;
        })
        .join("");
    inner = inner + "</ul>";
    return inner;
  } else {
    return textInner(output);
  }
}
const listWriter = createWriter(listInner);

function textInner(output) {
  return `<p>${output}</p>`;
}
const textWriter = createWriter(textInner);

function ulInner(output) {
  if (Array.isArray(output)) {
    return listInner(output, {
      ulClassName: "default-list",
      liClassName: "default-list-item",
    });
  } else if (output.title && output.items) {
    return `<p class='default-list-title'>${output.title}</p>${listInner(
      output.items,
      {
        ulClassName: "default-list",
        liClassName: "default-list-item",
      }
    )}`;
  } else {
    return textInner(output);
  }
}
const ulWriter = createWriter(ulInner);

function buildNestedList(cursor, list) {
  Object.entries(cursor).map(([key, value]) => {
    if (locationType(value) === types.DIR) {
      list.push(
        `<li class="tree-list-item directory">${key}<ul class="tree-list">`
      );
      buildNestedList(value, list);
      list.push("</ul></li>");
    } else {
      list.push(`<li class="tree-list-item">${key}</li>`);
    }
  });
  return list;
}

function treeInner(output) {
  if (Array.isArray(output)) {
    return listInner(output);
  } else if (typeof output === "object") {
    let inner = "<ul class='tree-list'>";
    return inner + buildNestedList(output, []).join("") + "</ul>";
  }
}
const treeWriter = createWriter(treeInner);
