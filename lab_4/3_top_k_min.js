// [8, 2, 5, 1, 9, 3]


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

function siftDown(heap, i) {
  while (true) {
    let best = i;
    const l = left(i);
    const r = right(i);

    if (l < heap.length && heap[l] > heap[best]) {
      best = l;
    }
    if (r < heap.length && heap[r] > heap[best]) {
      best = r;
    }

    if (best === i) break;

    swap(heap, i, best);
    i = best;
  }
}

function siftUp(heap, i) {
  while (i > 0) {
    const p = parent(i);
    if (heap[i] <= heap[p]) break;
    swap(heap, i, p);
    i = p;
  }
}

function topKMin(array, k) {
  const heap = [];

  for (const value of array) {
    if (heap.length < k) {
      heap.push(value);
      siftUp(heap, heap.length - 1);
    } else if (value < heap[0]) {
      heap[0] = value;
      siftDown(heap, 0);
    }
  }

  return heap.sort((a, b) => a - b);
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
  let array;

  try {
    array = parseNumberArray(input);
  } catch (error) {
    console.log("Ошибка:", error.message);
    rl.close();
    return;
  }

  if (array.length === 0) {
    console.log("Ошибка: массив пуст");
    rl.close();
    return;
  }

  rl.question("Введите k: ", (kInput) => {
    const k = Number(kInput);

    if (
      kInput.trim() === "" ||
      !Number.isInteger(k) ||
      k < 1 ||
      k > array.length
    ) {
      console.log("Ошибка: k должно быть целым числом от 1 до длины массива");
    } else {
      console.log("Результат:", topKMin(array, k));
    }

    rl.close();
  });
});
