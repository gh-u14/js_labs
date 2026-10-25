// banana -> anana


const { SuffixTree } = require("./1_suffix_tree");

const SEPARATOR = "#";

function reverseString(text) {
  return text.split("").reverse().join("");
}

// Наибольший палиндром. При нескольких ответах одной длины берется самый левый.
function longestPalindrome(text) {
  if (typeof text !== "string" || text.length === 0) {
    throw new Error("Нужна непустая строка");
  }

  if (text.includes(SEPARATOR) || text.includes("$")) {
    throw new Error("Строка не должна содержать символы # и $");
  }

  const n = text.length;
  const reversed = reverseString(text);
  // S + # + reverse(S) + $ ; $ добавляет само дерево
  const tree = new SuffixTree(text + SEPARATOR + reversed);

  let bestStart = 0;
  let bestLength = 1;

  for (let i = 0; i < n; i++) {
    // Нечетная длина, центр - символ i. Справа суффикс i + 1,
    // слева - суффикс перевернутой строки с зеркала S[i - 1].
    const oddRadius = tree.lcp(i + 1, 2 * n - i + 1);
    const oddLength = 2 * oddRadius + 1;

    if (oddLength > bestLength) {
      bestLength = oddLength;
      bestStart = i - oddRadius;
    }

    // Четная длина, центр между i - 1 и i.
    const evenRadius = tree.lcp(i, 2 * n - i + 1);
    const evenLength = 2 * evenRadius;

    if (evenLength > bestLength) {
      bestLength = evenLength;
      bestStart = i - evenRadius;
    }
  }

  return {
    text: text.slice(bestStart, bestStart + bestLength),
    start: bestStart,
    length: bestLength,
  };
}

function main() {
  const readline = require("node:readline");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Введите строку: ", (input) => {
    try {
      const palindrome = longestPalindrome(input);
      console.log("Палиндром:", palindrome.text);
      console.log("Длина:", palindrome.length);
      console.log("Индекс:", palindrome.start);
    } catch (error) {
      console.log("Ошибка:", error.message);
    } finally {
      rl.close();
    }
  });
}

module.exports = { longestPalindrome };

if (require.main === module) {
  main();
}
