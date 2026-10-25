// banana
// has ana | count a | nodes | exit


const TERMINATOR = "$";

class SuffixNode {
  constructor(suffixIndex = -1) {
    this.children = new Map();
    this.suffixIndex = suffixIndex;
  }
}

class SuffixEdge {
  constructor(start, end, target) {
    this.start = start;
    this.end = end;
    this.target = target;
  }
}

class SuffixTree {
  constructor(text) {
    if (typeof text !== "string" || text.length === 0) {
      throw new Error("Нужна непустая строка");
    }

    if (text.includes(TERMINATOR)) {
      throw new Error("Строка не должна содержать символ $");
    }

    this.text = text + TERMINATOR;
    this.root = new SuffixNode();

    for (let i = 0; i < this.text.length; i++) {
      this.#insert(i);
    }

    this.nodeCount = this.#countNodes(this.root);
  }

  get length() {
    return this.text.length - 1;
  }

  has(pattern) {
    return this.#walk(pattern) !== null;
  }

  count(pattern) {
    const node = this.#walk(pattern);
    if (!node) return 0;
    return this.#countLeaves(node);
  }

  // Длина общего префикса суффиксов, начинающихся в i и j
  lcp(i, j) {
    let node = this.root;
    let length = 0;

    while (i < this.text.length && j < this.text.length && this.text[i] === this.text[j]) {
      const edge = node.children.get(this.text[i]);
      if (!edge) break;

      for (let k = edge.start; k < edge.end; k++) {
        if (i >= this.text.length || j >= this.text.length || this.text[i] !== this.text[j]) {
          return length;
        }

        i += 1;
        j += 1;
        length += 1;
      }

      node = edge.target;
    }

    return length;
  }

  #insert(suffixStart) {
    let node = this.root;
    let i = suffixStart;

    while (i < this.text.length) {
      const edge = node.children.get(this.text[i]);

      if (!edge) {
        const leaf = new SuffixNode(suffixStart);
        node.children.set(this.text[i], new SuffixEdge(i, this.text.length, leaf));
        return;
      }

      let k = edge.start;

      while (k < edge.end && this.text[k] === this.text[i]) {
        k += 1;
        i += 1;
      }

      if (k === edge.end) {
        node = edge.target;
        continue;
      }

      const split = new SuffixNode();
      const remainder = new SuffixEdge(k, edge.end, edge.target);
      edge.end = k;
      edge.target = split;

      split.children.set(this.text[remainder.start], remainder);

      const leaf = new SuffixNode(suffixStart);
      split.children.set(this.text[i], new SuffixEdge(i, this.text.length, leaf));
      return;
    }

    throw new Error("Суффикс обязан закончиться листом: терминатор $ встречается один раз");
  }

  #walk(pattern) {
    if (typeof pattern !== "string" || pattern.length === 0) {
      throw new Error("Нужна непустая подстрока");
    }

    let node = this.root;
    let i = 0;

    while (i < pattern.length) {
      const edge = node.children.get(pattern[i]);
      if (!edge) return null;

      for (let k = edge.start; k < edge.end; k++) {
        if (i === pattern.length) return edge.target;
        if (this.text[k] !== pattern[i]) return null;
        i += 1;
      }

      node = edge.target;
    }

    return node;
  }

  #countLeaves(node) {
    if (node.suffixIndex >= 0) return 1;

    let count = 0;

    for (const edge of node.children.values()) {
      count += this.#countLeaves(edge.target);
    }

    return count;
  }

  #countNodes(node) {
    let count = 1;

    for (const edge of node.children.values()) {
      count += this.#countNodes(edge.target);
    }

    return count;
  }
}

function main() {
  const readline = require("node:readline");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

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

    try {
      if (command === "has") {
        if (arg === "") {
          throw new Error("has ожидает подстроку, например: has ana");
        }

        console.log(tree.has(arg) ? "Есть:" : "Нет:", arg);
        return true;
      }

      if (command === "count") {
        if (arg === "") {
          throw new Error("count ожидает подстроку, например: count a");
        }

        console.log("Вхождений:", tree.count(arg));
        return true;
      }

      if (command === "nodes") {
        console.log("Узлов:", tree.nodeCount);
        return true;
      }
    } catch (error) {
      console.log("Ошибка:", error.message);
      return true;
    }

    console.log("Ошибка: неизвестная команда");
    return true;
  }

  function promptLoop(tree) {
    rl.question("> ", (input) => {
      if (input === null) {
        rl.close();
        return;
      }

      if (handleCommand(tree, input)) {
        promptLoop(tree);
      } else {
        rl.close();
      }
    });
  }

  rl.question("Введите строку: ", (input) => {
    let tree;

    try {
      tree = new SuffixTree(input);
    } catch (error) {
      console.log("Ошибка:", error.message);
      rl.close();
      return;
    }

    console.log(`Символов: ${tree.length}, узлов: ${tree.nodeCount}`);
    console.log("Команды: has <подстрока>, count <подстрока>, nodes, exit");
    promptLoop(tree);
  });
}

module.exports = { SuffixTree };

if (require.main === module) {
  main();
}
