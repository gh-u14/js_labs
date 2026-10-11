// Команды: enqueue <number> | dequeue | peek | size | empty | exit
// Сначала выберите тип очереди: min или max


const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class PriorityQueue {
  constructor(isMin = true) {
    this.isMin = isMin;
    this.heap = [];
  }

  get size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.heap[0];
  }

  enqueue(value) {
    this.heap.push(value);
    this.#siftUp(this.heap.length - 1);
  }

  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }

    const top = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.#siftDown(0);
    }

    return top;
  }

  #hasPriority(a, b) {
    return this.isMin ? a < b : a > b;
  }

  #parent(i) {
    return Math.floor((i - 1) / 2);
  }

  #left(i) {
    return 2 * i + 1;
  }

  #right(i) {
    return 2 * i + 2;
  }

  #swap(i, j) {
    const tmp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = tmp;
  }

  #siftUp(i) {
    while (i > 0) {
      const p = this.#parent(i);
      if (!this.#hasPriority(this.heap[i], this.heap[p])) break;
      this.#swap(i, p);
      i = p;
    }
  }

  #siftDown(i) {
    while (true) {
      let best = i;
      const l = this.#left(i);
      const r = this.#right(i);

      if (l < this.heap.length && this.#hasPriority(this.heap[l], this.heap[best])) {
        best = l;
      }
      if (r < this.heap.length && this.#hasPriority(this.heap[r], this.heap[best])) {
        best = r;
      }

      if (best === i) break;

      this.#swap(i, best);
      i = best;
    }
  }
}

function handleCommand(queue, line) {
  const [command, arg] = line.trim().split(/\s+/);
  const cmd = command.toLowerCase();

  if (cmd === "exit") {
    return false;
  }

  if (cmd === "enqueue") {
    const value = Number(arg);

    if (arg === undefined || !Number.isFinite(value)) {
      console.log("Ошибка: enqueue ожидает число, например: enqueue 5");
      return true;
    }

    queue.enqueue(value);
    console.log("Добавлено:", value);
    return true;
  }

  if (cmd === "dequeue") {
    if (queue.isEmpty()) {
      console.log("Очередь пуста");
    } else {
      console.log("Извлечено:", queue.dequeue());
    }
    return true;
  }

  if (cmd === "peek") {
    if (queue.isEmpty()) {
      console.log("Очередь пуста");
    } else {
      console.log("Корень:", queue.peek());
    }
    return true;
  }

  if (cmd === "size") {
    console.log("Размер:", queue.size);
    return true;
  }

  if (cmd === "empty") {
    console.log(queue.isEmpty() ? "Пустая" : "Не пустая");
    return true;
  }

  console.log("Ошибка: неизвестная команда");
  return true;
}

function promptLoop(queue) {
  rl.question("> ", (input) => {
    if (input === null) {
      rl.close();
      return;
    }

    const shouldContinue = handleCommand(queue, input);

    if (shouldContinue) {
      promptLoop(queue);
    } else {
      rl.close();
    }
  });
}

console.log("Команды: enqueue <n>, dequeue, peek, size, empty, exit");

rl.question("Тип очереди (min/max): ", (typeInput) => {
  const type = typeInput.trim().toLowerCase();

  if (type !== "min" && type !== "max") {
    console.log("Ошибка: укажите min или max");
    rl.close();
    return;
  }

  const queue = new PriorityQueue(type === "min");
  console.log(`Создана ${type === "min" ? "Min" : "Max"} Priority Queue`);
  promptLoop(queue);
});
