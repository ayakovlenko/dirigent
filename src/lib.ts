interface Step<S> {
  execute(state: S): S | PromiseLike<S>;
}

export type { Step };

class StepSequence<S> implements Step<S> {
  constructor(private steps: Step<S>[]) {}

  async execute(state: S): Promise<S> {
    return await stepLoop(this.steps, state);
  }
}

export { StepSequence };

async function stepLoop<S>(steps: Step<S>[], state: S): Promise<S> {
  for (const step of steps) {
    state = deepFreeze(state);
    // deno-lint-ignore no-await-in-loop
    state = await step.execute(state);
  }
  return state;
}

// https://decipher.dev/30-seconds-of-typescript/docs/deepFreeze/
function deepFreeze(obj: any): typeof obj {
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

export { deepClone, stepLoop };
