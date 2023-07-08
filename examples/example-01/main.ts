import { Step, StepSequence } from "../../modules/core/mod.ts";

type State = {
  history: number[];
};

class AppendStep extends Step<State> {
  constructor(private x: number) {
    super();
  }

  override onRun(oldState: State): State {
    const newState: State = oldState;
    newState.history.push(this.x);
    return newState;
  }

  override onStateChanged(oldState: State, newState: State): void {
    console.table({ oldState, newState });
    return;
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
