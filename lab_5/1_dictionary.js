// Команды: add <слово> | add-list ["слово", ...] | has <слово> | size | exit


const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// алфавит кириллицы
const ALPHABET = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
const LETTERS = new Set(ALPHABET);

class TrieNode {
  constructor() {
    this.children = new Map();
    this.isWord = false;
  }
}

class Dictionary {
  constructor() {
    this.root = new TrieNode();
    this.wordCount = 0;
  }

  get size() {
    return this.wordCount;
  }

  add(word) {
    return this.#insert(normalizeWord(word));
  }

  addMany(words) {
    if (!Array.isArray(words)) {
      throw new Error('Нужен массив слов, например ["кот", "кит"]');
    }

    const normalized = words.map((word) => normalizeWord(word));
    let added = 0;

    for (const word of normalized) {
      if (this.#insert(word)) added += 1;
    }

    return { added, total: normalized.length };
  }

  has(word) {
    let node = this.root;

    for (const char of normalizeWord(word)) {
      node = node.children.get(char);
      if (!node) return false;
    }

    return node.isWord;
  }

  #insert(word) {
    let node = this.root;

    for (const char of word) {
      let next = node.children.get(char);
      if (!next) {
        next = new TrieNode();
        node.children.set(char, next);
      }
      node = next;
    }

    if (node.isWord) return false;

    node.isWord = true;
    this.wordCount += 1;
    return true;
  }
}

function normalizeWord(word) {
  if (typeof word !== "string") {
    throw new Error("Слово должно быть строкой");
  }

  const normalized = word.trim().toLocaleLowerCase("ru");

  if (normalized.length === 0 || !isCyrillic(normalized)) {
    throw new Error(
      "Слово должно состоять из кириллицы (а-я), например: словарь"
    );
  }

  return normalized;
}

function isCyrillic(word) {
  for (const char of word) {
    if (!LETTERS.has(char)) return false;
  }
  return true;
}

function parseWordList(input) {
  let array;

  try {
    array = JSON.parse(input);
  } catch {
    throw new Error('Нужен JSON-массив слов, например ["кот", "кит"]');
  }

  if (!Array.isArray(array)) {
    throw new Error('Нужен JSON-массив слов, например ["кот", "кит"]');
  }

  return array;
}

function handleCommand(dictionary, line) {
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
    if (command === "add") {
      if (arg === "") {
        throw new Error("add ожидает слово, например: add кот");
      }

      const word = normalizeWord(arg);
      const added = dictionary.add(word);
      console.log(added ? "Добавлено:" : "Уже есть:", word);
      return true;
    }

    if (command === "add-list") {
      if (arg === "") {
        throw new Error('add-list ожидает массив, например: add-list ["кот", "кит"]');
      }

      const { added, total } = dictionary.addMany(parseWordList(arg));
      console.log(`Добавлено новых: ${added} из ${total}`);
      return true;
    }

    if (command === "has") {
      if (arg === "") {
        throw new Error("has ожидает слово, например: has кот");
      }

      const word = normalizeWord(arg);
      console.log(dictionary.has(word) ? "Есть:" : "Нет:", word);
      return true;
    }

    if (command === "size") {
      console.log("Размер:", dictionary.size);
      return true;
    }
  } catch (error) {
    console.log("Ошибка:", error.message);
    return true;
  }

  console.log("Ошибка: неизвестная команда");
  return true;
}

function promptLoop(dictionary) {
  rl.question("> ", (input) => {
    if (input === null) {
      rl.close();
      return;
    }

    if (handleCommand(dictionary, input)) {
      promptLoop(dictionary);
    } else {
      rl.close();
    }
  });
}

console.log(
  'Команды: add <слово>, add-list ["слово", ...], has <слово>, size, exit'
);

promptLoop(new Dictionary());
