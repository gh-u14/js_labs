// [1, 2, 3, 4, 5, 6]
// bfs | inorder | preorder | postorder | show | exit


const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Узел: значение, родитель и не больше двух потомков
// У корня parent === null. Левый и правый потомок упорядочены:
// inorder читает их как "левый, узел, правый"
class TreeNode {
  constructor(value) {
    this.value = value;
    this.parent = null;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor(values) {
    this.#check(values);

    this.root = new TreeNode(values[0]);
    const queue = [this.root];
    let head = 0;
    let i = 1;

    while (i < values.length) {
      if (head === queue.length) {
        throw new Error("У значения нет родителя");
      }

      const node = queue[head];
      head += 1;

      if (values[i] !== null) {
        node.left = this.#adopt(node, values[i]);
        queue.push(node.left);
      }
      i += 1;

      if (i === values.length) break;

      if (values[i] !== null) {
        node.right = this.#adopt(node, values[i]);
        queue.push(node.right);
      }
      i += 1;
    }

    this.size = queue.length;
  }

  bfs() {
    const result = [];
    const queue = [this.root];
    // head вместо shift: сдвиг массива на каждом узле дал бы O(n^2)
    let head = 0;

    while (head < queue.length) {
      const node = queue[head];
      head += 1;
      result.push(node.value);

      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }

    return result;
  }

  preorder() {
    const result = [];
    const stack = [this.root];

    while (stack.length > 0) {
      const node = stack.pop();
      result.push(node.value);

      // Правый кладется раньше: следующим снимется левый
      if (node.right !== null) stack.push(node.right);
      if (node.left !== null) stack.push(node.left);
    }

    return result;
  }

  inorder() {
    const result = [];
    const stack = [];
    let current = this.root;

    while (current !== null || stack.length > 0) {
      while (current !== null) {
        stack.push(current);
        current = current.left;
      }

      current = stack.pop();
      result.push(current.value);
      current = current.right;
    }

    return result;
  }

  postorder() {
    const result = [];
    const stack = [];
    let current = this.root;
    // Узел, уже записанный в ответ. Если правый потомок совпал с ним,
    // правое поддерево пройдено и можно записать текущий узел
    let last = null;

    while (current !== null || stack.length > 0) {
      if (current !== null) {
        stack.push(current);
        current = current.left;
        continue;
      }

      const peek = stack[stack.length - 1];

      if (peek.right !== null && peek.right !== last) {
        current = peek.right;
        continue;
      }

      result.push(peek.value);
      last = stack.pop();
    }

    return result;
  }

  format() {
    const lines = [];
    const stack = [{ node: this.root, depth: 0, branch: "" }];

    while (stack.length > 0) {
      const item = stack.pop();
      const node = item.node;
      const gap = "  ".repeat(item.depth);
      const branch = item.branch === "" ? "" : `${item.branch} `;
      const parent = node.parent === null ? "—" : node.parent.value;

      lines.push(`${gap}${branch}${node.value} (parent: ${parent})`);

      if (node.right !== null) {
        stack.push({ node: node.right, depth: item.depth + 1, branch: "R" });
      }
      if (node.left !== null) {
        stack.push({ node: node.left, depth: item.depth + 1, branch: "L" });
      }
    }

    return lines.join("\n");
  }

  #check(values) {
    if (!Array.isArray(values) || values.length === 0) {
      throw new Error("Нужен непустой массив в порядке BFS, например [1, 2, 3, 4, 5]");
    }

    for (let i = 0; i < values.length; i++) {
      const value = values[i];

      if (value === null) {
        if (i === 0) throw new Error("Корень не может быть null");
        continue;
      }

      if (!isNodeValue(value)) {
        throw new Error("Узел — конечное число или непустая строка, null — отсутствие потомка");
      }
    }
  }

  #adopt(parent, value) {
    const child = new TreeNode(value);
    child.parent = parent;
    return child;
  }
}

function isNodeValue(value) {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string") return value.length > 0;
  return false;
}

function parseLevelOrder(input) {
  try {
    return JSON.parse(input);
  } catch {
    throw new Error("Нужен JSON-массив, например [1, 2, 3, 4, 5]");
  }
}

function handleCommand(tree, line) {
  const trimmed = line.trim();

  if (trimmed === "") {
    console.log("Ошибка: пустая команда");
    return true;
  }

  const space = trimmed.indexOf(" ");
  const command = (space === -1 ? trimmed : trimmed.slice(0, space)).toLowerCase();
  const arg = space === -1 ? "" : trimmed.slice(space + 1).trim();

  if (command === "exit") {
    return false;
  }

  if (arg !== "") {
    console.log("Ошибка: команда не принимает аргументы");
    return true;
  }

  try {
    if (command === "bfs") {
      console.log("BFS:", tree.bfs());
      return true;
    }

    if (command === "inorder") {
      console.log("DFS Inorder:", tree.inorder());
      return true;
    }

    if (command === "preorder") {
      console.log("DFS Preorder:", tree.preorder());
      return true;
    }

    if (command === "postorder") {
      console.log("DFS Postorder:", tree.postorder());
      return true;
    }

    if (command === "show") {
      console.log(tree.format());
      return true;
    }
  } catch (error) {
    console.log("Ошибка:", error.message);
    return true;
  }

  console.log("Ошибка: неизвестная команда");
  return true;
}

function main() {
  rl.question("Введите дерево в порядке BFS: ", (input) => {
    let tree;

    try {
      tree = new BinaryTree(parseLevelOrder(input));
    } catch (error) {
      console.log("Ошибка:", error.message);
      rl.close();
      return;
    }

    console.log(`Узлов: ${tree.size}`);
    console.log("Команды: bfs, inorder, preorder, postorder, show, exit");

    rl.setPrompt("> ");
    rl.prompt();

    rl.on("line", (line) => {
      if (handleCommand(tree, line)) {
        rl.prompt();
      } else {
        rl.close();
      }
    });
  });
}

module.exports = { BinaryTree };

if (require.main === module) {
  main();
}
