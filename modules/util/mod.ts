// deno-lint-ignore no-explicit-any
function deepFreeze(obj: any): typeof obj {
  // ref: https://decipher.dev/30-seconds-of-typescript/docs/deepFreeze/
  Object.keys(obj).forEach((prop) => {
    if (typeof obj[prop] === "object" && !Object.isFrozen(obj[prop])) {
      deepFreeze(obj[prop]);
    }
  });
  return Object.freeze(obj);
}

function deepClone<S>(s: S): S {
  return JSON.parse(JSON.stringify(s));
}

export { deepClone, deepFreeze };
