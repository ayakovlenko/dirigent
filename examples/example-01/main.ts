import { Step, stepLoop, StepSequence } from "../../modules/core/mod.ts";
import { deepClone } from "../../modules/util/mod.ts";

type State = {
  history: number[];
};

class AppendStep implements Step<State> {
  constructor(private x: number) {
  }

  execute(state: State): State | PromiseLike<State> {
    const newState: State = deepClone(state);
    newState.history.push(this.x);
    return newState;
  }
}

const initialState: State = {
  history: [],
};

const steps =
  new StepSequence<State>([
    new AppendStep(1),
    new StepSequence<State>([
      new AppendStep(2),
      new AppendStep(3),
      new AppendStep(4),
    ]),
    new AppendStep(5),
  ]);

const newState = await steps.execute(initialState);

console.log(newState);
