abstract class Step<S> {
  //

  execute(oldState: S): S | PromiseLike<S> {
    oldState = deepFreeze(oldState);

    return this.onRun(oldState);
  }

  abstract onRun(oldState: S): S | PromiseLike<S>;
}

class StepSequence<S> extends Step<S> {
  //

  constructor(private steps: Step<S>[]) {
    super();
  }

  onRun(oldState: S): S | PromiseLike<S> {
    return stepLoop(this.steps, oldState);
  }
}

async function stepLoop<S>(steps: Step<S>[], state: S): Promise<S> {
  for (const step of steps) {
    // deno-lint-ignore no-await-in-loop
    state = await step.execute(state);
  }
  return state;
}

// deno-lint-ignore no-explicit-any
const deepFreeze = (obj: any) => {
  // ref: https://decipher.dev/30-seconds-of-typescript/docs/deepFreeze/
  for (const prop of Object.keys(obj)) {
    if (typeof obj[prop] === "object" && !Object.isFrozen(obj[prop])) {
      deepFreeze(obj[prop]);
    }
  }
  return Object.freeze(obj);
};

export { Step, StepSequence };
