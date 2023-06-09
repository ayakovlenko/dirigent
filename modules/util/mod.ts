function deepClone<S>(s: S): S {
  return JSON.parse(JSON.stringify(s));
}

export { deepClone };
