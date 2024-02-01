# Advent of Code

My solutions to the [Advent of Code](https://adventofcode.com/) programming
puzzles written in [TypeScript](https://typescriptlang.org/).

> **Note**: My solutions are neither the most performant nor the cleanest.

## Getting Started

### Prerequisites

- [Deno](https://deno.land/)

### Installation

Clone the repository.

```
git clone https://github.com/mateuszaliyev/advent-of-code.git
```

```
git clone git@github.com:mateuszaliyev/advent-of-code.git
```

Go to the project directory.

```
cd advent-of-code
```

## Usage

### Solutions

Display solutions for a chosen `<DAY>` of a `<YEAR>` and an optional `<INPUT>`
path relative to the `/src/<YEAR>/<DAY>` directory (`input.txt` by default).

```
deno run --allow-read ./src/solutions.ts --year <YEAR> --day <DAY> --input <INPUT>
```

#### Examples

Solution for an `input.txt` file.

```
deno run --allow-read ./src/solutions.ts --year 2022 --day 1
```

```
deno run --allow-read ./src/solutions.ts --year 2022 --day 1 --input input.txt
```

Solution for an `example.txt` file.

```
deno run --allow-read ./src/solutions.ts --year 2022 --day 1 --input example.txt
```

### Detailed Private Leaderboards

Display a private `<LEADERBOARD>` results including timestamps and amount of
points for a given `<DAY>` and `<PART>`.

`<SESSION>` cookie is required to authorize the request. You can either insert
it using the `--session` flag or set an environment variable named `SESSION`.

```
deno run --allow-env --allow-net=adventofcode.com --allow-read ./src/scripts/private.ts --session <SESSION> --leaderboard <LEADERBOARD> --day <DAY> --part <PART>
```

#### Examples

Using `--session` argument.

```
deno run --allow-net=adventofcode.com ./src/scripts/private.ts --session fd9a83558d596fc3edd67de86a0dec8dc0f96eebd1f8efd4ef4d52de62f58dea2aa89e7bf0365befb0ba6f23c0487453e931c478f5608565c63530e89686836c --leaderboard 123456 --day 1 --part 2
```

Using `SESSION` environment variable.

```
deno run --allow-env --allow-net=adventofcode.com,deno.land --allow-read ./src/scripts/private.ts --leaderboard 123456 --day 1 --part 2
```

### Formatting

For consistency with my other projects, use [Prettier](https://prettier.io/)
instead of [`deno fmt`](https://deno.land/manual@v1.28.3/tools/formatter) when
formatting code.

```
npx prettier --write .

pnpm dlx prettier --write .
```

## Authors

- Mateusz Aliyev ([@mateuszaliyev](https://github.com/mateuszaliyev))

## License

[MIT](https://github.com/mateuszaliyev/advent-of-code/blob/main/LICENSE)
