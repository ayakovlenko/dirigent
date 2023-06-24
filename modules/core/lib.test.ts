import { deepClone } from "../util/mod.ts";
import { assertEquals } from "./deps_test.ts";
import { Step, StepSequence } from "./lib.ts";

type State = {
  history: number[];
};

class AppendStep extends Step<State> {
  constructor(private x: number) {
    super();
  }

  onRun(state: State): State | PromiseLike<State> {
    const newState: State = deepClone(state);
    newState.history.push(this.x);
    return newState;
  }
}

Deno.test("stepLoop propagates the state", async () => {
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
    ])

  const newState = await steps.execute(initialState);

  assertEquals(newState.history, [1, 2, 3, 4, 5]);
});
