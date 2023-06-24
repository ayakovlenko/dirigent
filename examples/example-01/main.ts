import { Step, StepSequence } from "../../modules/core/mod.ts";
import { deepClone } from "../../modules/util/mod.ts";

type State = {
  history: number[];
};

class AppendStep extends Step<State> {
  constructor(private x: number) {
    super();
  }

  onRun(oldState: State): State {
    const newState: State = deepClone(oldState);
    newState.history.push(this.x);
    return newState;
  }
}

const initialState: State = {
  history: [],
};

const steps = new StepSequence<State>([
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
