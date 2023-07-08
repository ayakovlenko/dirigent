import { jsonEqual } from "../lib/json-equal/mod.ts";
import { deepClone } from "../util/mod.ts";

abstract class Step<S> {
  //

  async execute(oldState: S): Promise<S> {
    /// deepFreeze(oldState);
    const mustRun = this.mustRun(oldState);
    if (!mustRun) {
      return oldState;
    }
    const oldStateClone = deepClone(oldState);
    const newState = await this.onRun(oldStateClone);
    const hasStateChanged = jsonEqual(oldState, newState);
    if (hasStateChanged) {
      await this.onStateChanged(oldState, newState);
    }
    return newState;
  }

  abstract onRun(oldState: S): S | PromiseLike<S>;

  mustRun(_oldState: S): boolean | PromiseLike<boolean> {
    return true;
  }

  onStateChanged(_oldState: S, _newState: S): void | PromiseLike<void> {
    return;
  }
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
function deepFreeze(obj: any): void {
  // ref: https://decipher.dev/30-seconds-of-typescript/docs/deepFreeze/
  for (const prop of Object.keys(obj)) {
    if (typeof obj[prop] === "object" && !Object.isFrozen(obj[prop])) {
      deepFreeze(obj[prop]);
    }
  }
  Object.freeze(obj);
}

export { Step, StepSequence };
