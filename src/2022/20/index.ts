import { getInput } from "@/utilities/get-input.ts";

type Node = {
  key: number;
  next?: Node;
  previous?: Node;
  value: number;
};

const file = (await getInput(import.meta.url)).split("\n").map(Number);

const toArray = (list: Node[]) => {
  const result: number[] = [];

  for (let i = 0, node = list[0]; i < list.length; i++, node = node.next!)
    result.push(node.value);

  return result;
};

const toList = (array: number[]) => {
  const list: Node[] = array.map((value, key) => ({
    key,
    value,
  }));

  for (let index = 0; index < list.length; index++) {
    list[index].next = list.at((index + 1) % list.length);
    list[index].previous = list.at(index - 1);
  }

  return list;
};

const mix = (file: number[], rounds: number) => {
  const list = toList(file);

  for (let round = 0; round < rounds; round++) {
    for (let index = 0; index < file.length; index++) {
      const node = list.find((node) => node.key === index)!;
      let move = node.value % (list.length - 1);

      while (move) {
        const current = node;
        const next = node.next!;
        const previous = node.previous!;

        if (move > 0) {
          current.next = next.next;
          current.previous = next;

          next.previous = previous;
          next.next!.previous = current;
          next.next = current;

          previous.next = next;

          move--;
          continue;
        }

        current.next = previous;
        current.previous = previous.previous;

        next.previous = previous;

        previous.next = next;
        previous.previous!.next = current;
        previous.previous = current;

        move++;
      }
    }
  }

  return toArray(list);
};

const grove = (file: number[], rounds: number) => {
  const mixed = mix(file, rounds);
  const zero = mixed.indexOf(0);
  return [1000, 2000, 3000].reduce(
    (sum, term) => sum + mixed[(zero + term) % mixed.length],
    0
  );
};

console.log("Part 1 -", grove(file, 1));
console.log(
  "Part 2 -",
  grove(
    file.map((value) => value * 811589153),
    10
  )
);
