export type TableColumn<T> = {
  "Part 1"?: T;
  "Part 2"?: T;
};

export class Part<R> {
  private getResult: () => R;

  readonly result: R;
  readonly time: number;

  constructor(getResult: () => R) {
    this.getResult = getResult;

    const start = performance.now();
    this.result = this.getResult();
    this.time = performance.now() - start;
  }
}

export class Result<R1, R2> {
  private part1: Part<R1>;
  private part2: Part<R2>;

  constructor(part1: Part<R1>, part2: Part<R2>) {
    this.part1 = part1;
    this.part2 = part2;

    this.display();
  }

  private display() {
    const table: {
      Result: TableColumn<number | string>;
      Time: TableColumn<string>;
    } = {
      Result: {},
      Time: {
        "Part 1": `${(this.part1.time / 1000).toFixed(3)}s`,
        "Part 2": `${(this.part2.time / 1000).toFixed(3)}s`,
      },
    };

    [this.part1, this.part2].forEach(({ result }, index) => {
      if (typeof result === "number" || typeof result === "string") {
        table.Result[`Part ${(index + 1) as 1 | 2}`] = result;
      }
    });

    console.table(table);

    [this.part1, this.part2].forEach(({ result }, index) => {
      if (typeof result !== "number" && typeof result !== "string") {
        console.log(`Part ${index + 1} -`, result);
      }
    });
  }
}
