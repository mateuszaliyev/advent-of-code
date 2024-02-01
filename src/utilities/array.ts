export const chunk = <T>(array: T[], size: number): T[][] =>
  size > 0
    ? array.reduce<T[][]>((chunks, value, index) => {
        const chunkIndex = Math.floor(index / size);

        if (!chunks[chunkIndex]) {
          chunks.push([]);
        }

        chunks[chunkIndex]!.push(value);

        return chunks;
      }, [])
    : [array];

export const sum = (array: number[]) =>
  array.reduce((sum, value) => sum + value, 0);

export const zip = <T extends unknown[][]>(...arrays: T) => {
  const result: { [P in keyof T]: T[P][number] }[] = [];

  for (let i = 0; i < Math.min(...arrays.map((array) => array.length)); i++)
    result.push(arrays.map((array) => array[i]) as (typeof result)[number]);

  return result;
};
