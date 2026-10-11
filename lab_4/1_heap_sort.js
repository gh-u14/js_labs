// [3, 1, 4, 1, 5]


const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function parent(i) {
  return Math.floor((i - 1) / 2);
}

function left(i) {
  return 2 * i + 1;
}

function right(i) {
  return 2 * i + 2;
}

function swap(array, i, j) {
  const tmp = array[i];
  array[i] = array[j];
  array[j] = tmp;
}

// compare(a, b) === true - a имеет больший приоритет, чем b
function siftDown(array, i, heapSize, compare) {
  while (true) {
    let best = i;
    const l = left(i);
    const r = right(i);

    if (l < heapSize && compare(array[l], array[best])) {
      best = l;
    }
    if (r < heapSize && compare(array[r], array[best])) {
      best = r;
    }

    if (best === i) break;

    swap(array, i, best);
    i = best;
  }
}

function siftUp(array, i, compare) {
  while (i > 0) {
    const p = parent(i);
    if (!compare(array[i], array[p])) break;
    swap(array, i, p);
    i = p;
  }
}

function buildHeap(array, compare) {
  for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
    siftDown(array, i, array.length, compare);
  }
  return array;
}

function isMax(a, b) {
  return a > b;
}

function isMin(a, b) {
  return a < b;
}

function heapSort(array) {
  const result = [...array];
  const n = result.length;

  buildHeap(result, isMax);

  for (let end = n - 1; end > 0; end--) {
    swap(result, 0, end);
    siftDown(result, 0, end, isMax);
  }

  return result;
}

function parseNumberArray(input) {
  const array = JSON.parse(input);

  if (!Array.isArray(array)) {
    throw new Error("Нужно ввести массив в квадратных скобках");
  }

  if (!array.every((x) => typeof x === "number" && Number.isFinite(x))) {
    throw new Error("Все элементы должны быть конечными числами");
  }

  return array;
}

rl.question("Введите массив чисел: ", (input) => {
  try {
    const array = parseNumberArray(input);
    const sorted = heapSort(array);
    console.log("Результат:", sorted);
  } catch (error) {
    console.log("Ошибка:", error.message);
  } finally {
    rl.close();
  }
});
