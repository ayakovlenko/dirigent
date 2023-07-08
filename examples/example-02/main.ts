import { StepSequence } from "../../modules/core/mod.ts";
import { FsPersistedStep } from "../../modules/persistence/fs/mod.ts";

type State = {
  history: number[];
};

const config = {
  persistence: {
    path: "/tmp/state.json",
  },
};

abstract class PersistedStep extends FsPersistedStep<State> {
  constructor() {
    super(config.persistence.path);
  }
}

class AppendStep extends PersistedStep {
  constructor(private x: number) {
    super();
  }

  override onRun(oldState: State): State {
    const newState: State = oldState;
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

await steps.execute(initialState);

console.log(`cat ${config.persistence.path} | jq`);
