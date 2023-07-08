// deno-lint-ignore no-explicit-any
function jsonEqual(a: any, b: any): boolean {
  return JSON.stringify(a) !== JSON.stringify(b); // HACK!
}

export { jsonEqual };
