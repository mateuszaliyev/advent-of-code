export const chunk = <T>(array: T[], size: number): T[][] =>
  size > 0
    ? array.reduce<T[][]>((chunks, value, index) => {
        const chunkIndex = Math.floor(index / size);

        if (!chunks[chunkIndex]) {
          chunks.push([]);
        }

        chunks[chunkIndex].push(value);

        return chunks;
      }, [])
    : [array];

export const sum = (array: number[]) =>
  array.reduce((sum, value) => sum + value, 0);
