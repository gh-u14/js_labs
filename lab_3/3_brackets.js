const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function isBalanced(text) {
  const stack = [];
  const opening = "([{<";
  const pairs = {
    ")": "(",
    "]": "[",
    "}": "{",
    ">": "<",
  };

  for (const char of text) {
    if (opening.includes(char)) {
      stack.push(char);
    } else if (Object.hasOwn(pairs, char)) {
      if (stack.pop() !== pairs[char]) {
        return false;
      }
    } else {
      // Допускаем только скобки
      return false;
    }
  }

  return stack.length === 0;
}

rl.question("Введите последовательность скобок: ", (input) => {
  console.log(
    isBalanced(input) ? "Корректный ввод" : "Некорректный ввод"
  );

  rl.close();
});