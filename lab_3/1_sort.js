// [10, "банан", true, null, 2, "ананас", false]

const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Введите массив: ", (input) => {
  try {
    const array = JSON.parse(input);

    if (!Array.isArray(array)) {
      throw new Error("Нужно ввести массив в квадратных скобках");
    }

    const sorted = [...array].sort(compare);
    console.log("Результат:", sorted);
  } catch (error) {
    console.log("Ошибка:", error.message);
  } finally {
    rl.close();
  }
});

function typeOrder(value) {
  if (typeof value === "number") return 0;
  if (typeof value === "string") return 1;
  if (typeof value === "boolean") return 2;
  if (value === null) return 3;
  if (value === undefined) return 4;

  return 5; // Остальные типы
}

function compare(a, b) {
  const orderA = typeOrder(a);
  const orderB = typeOrder(b);

  if (orderA !== orderB) return orderA - orderB;

  if (typeof a === "number") {
    // NaN ставим после остальных чисел
    if (Number.isNaN(a)) return Number.isNaN(b) ? 0 : 1;
    if (Number.isNaN(b)) return -1;
    return a === b ? 0 : a - b;
  }

  if (typeof a === "string") {
    return a.localeCompare(b, "ru");
  }

  if (typeof a === "boolean") {
    return Number(a) - Number(b);
  }

  return 0;
}

