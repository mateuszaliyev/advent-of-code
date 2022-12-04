export const log = {
  debug: (...args: unknown[]) => {
    console.log("\x1b[35mdebug\x1b[0m - ", ...args);
  },
  error: (...args: unknown[]) => {
    console.error("\x1b[31merror\x1b[0m - ", ...args);
  },
  info: (...args: unknown[]) => {
    console.log("\x1b[36minfo\x1b[0m - ", ...args);
  },
  warn: (...args: unknown[]) => {
    console.warn("\x1b[33mwarn\x1b[0m - ", ...args);
  },
};
