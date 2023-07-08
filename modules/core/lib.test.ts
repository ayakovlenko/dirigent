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
  const initialState: State = { history: [] };

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

  assertEquals(newState.history, [1, 2, 3, 4, 5]);
});

//

class OnStateChangedSpy extends Step<State> {
  private changeState: boolean;

  public onStateChangedEntered = false;

  constructor(
    { changeState }: { changeState: boolean },
  ) {
    super();
    this.changeState = changeState;
  }

  onRun(state: State): State | PromiseLike<State> {
    const newState: State = deepClone(state);
    if (this.changeState) {
      newState.history.push(1);
    }
    return newState;
  }

  onStateChanged(_oldState: State, _newState: State): void {
    this.onStateChangedEntered = true;
  }
}

Deno.test("onStateChange", async (t) => {
  await t.step("is entered when a state changes", async () => {
    const initialState: State = { history: [] };

    const spy = new OnStateChangedSpy({ changeState: true });
    const newState = await spy.execute(initialState);

    assertEquals(spy.onStateChangedEntered, true);
    assertEquals(newState.history, [1]);
  });

  await t.step("is not entered when a state does not change", async () => {
    const initialState: State = { history: [] };

    const spy = new OnStateChangedSpy({ changeState: false });
    const newState = await spy.execute(initialState);

    assertEquals(spy.onStateChangedEntered, false);
    assertEquals(newState.history, []);
  });
});
