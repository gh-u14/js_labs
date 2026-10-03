const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function binarySearch(array, target) {
  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const middle = left + Math.floor((right - left) / 2);

    if (array[middle] === target) {
      return middle;
    }

    if (array[middle] < target) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}

rl.question("Введите массив целых чисел: ", (input) => {
  let array;

  try {
    array = JSON.parse(input);

    if (!Array.isArray(array) || !array.every(Number.isSafeInteger)) {
      throw new Error("Введите массив целых чисел, например [8, 2, 5, 1]");
    }
  } catch (error) {
    console.log("Ошибка:", error.message);
    rl.close();
    return;
  }

  array.sort((a, b) => a - b);
  console.log("Отсортированный массив:", array);

  rl.question("Введите число для поиска: ", (input) => {
    const target = Number(input);

    if (input.trim() === "" || !Number.isSafeInteger(target)) {
      console.log("Ошибка: нужно ввести целое число");
    } else {
      const index = binarySearch(array, target);

      if (index === -1) {
        console.log("Число не найдено");
      } else {
        console.log("Индекс в отсортированном массиве:", index);
      }
    }

    rl.close();
  });
});