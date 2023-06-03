# dirigent

_ChatGPT-generated readme_

The provided code is written in TypeScript, a statically typed superset of
JavaScript. This code defines a series of constructs related to the concept of a
'Step', which is an operation that transforms a state `S` in some way.

Here's a detailed breakdown:

1. `interface Step<S>`: This interface represents an abstraction of a 'step'.
   Any class implementing this interface must provide an `execute` function that
   takes a state `S` and returns a possibly modified state `S`. The returned
   state can be either a simple value or a Promise that resolves to a value.

2. `class StepSequence<S> implements Step<S>`: This class implements the `Step`
   interface for a sequence of steps. It takes an array of steps in its
   constructor and executes them in sequence when its `execute` function is
   called.

3. `stepLoop<S>(steps: Step<S>[], state: S): Promise<S>`: This is an
   asynchronous helper function used by `StepSequence` to execute a sequence of
   steps. It iterates over each step, freezes the state to prevent unwanted
   mutations, and then executes the step. The result of each step is fed as the
   state into the next one. The final state is returned as a promise.

4. `deepFreeze(obj: any): typeof obj`: This function recursively freezes an
   object and all its properties using `Object.freeze`, which prevents them from
   being modified. This is used in `stepLoop` to prevent steps from modifying
   the state directly.

5. `deepClone<S>(s: S): S`: This function makes a deep copy of an object by
   converting it to a JSON string and then parsing it back to an object. This
   creates a new copy of the object that shares no references with the original.

The overall purpose of this code seems to be to execute a sequence of 'steps' in
a controlled and safe manner. Each step gets a frozen copy of the current state,
which it can use to produce a new state without affecting the old one. This
could be used, for example, in a state machine or game engine where each step
represents a game tick, player action, or AI decision.

## Example

```ts
const initialState: State = {
  history: [],
};

const steps = [
  new StepSequence<State>([
    new AppendStep(1),
    new StepSequence<State>([
      new AppendStep(2),
      new AppendStep(3),
      new AppendStep(4),
    ]),
    new AppendStep(5),
  ]),
];

const newState = await stepLoop(steps, initialState);

assertEquals(newState.history, [1, 2, 3, 4, 5]);
```

Firstly, a new type `State` is defined. This state is an object that holds a
single property: `history` which is an array of numbers.

Next, a new class `AppendStep` implementing the `Step` interface is defined.
`AppendStep` essentially represents a step in the process that appends a number
to the `history` array. It does this in a non-mutative way, by creating a deep
clone of the current state, modifying this clone, and then returning it.

Finally, a test case is defined to check whether the step-based logic works as
expected. In the test, an initial state is defined with an empty `history`
array. A sequence of steps is then created. This sequence includes a mix of
individual `AppendStep` instances and nested `StepSequence` instances, mimicking
a complex scenario.

The `stepLoop` function is called with this array of steps and the initial
state. The `stepLoop` function executes each step in order, each time passing
the newly returned state into the next step. The result is a final state that
has passed through all the steps.

The test then verifies that the `history` property of the final state matches
the expected sequence of numbers, `[1, 2, 3, 4, 5]`. If the `history` array is
as expected, it means that all the steps have been executed correctly in the
correct order.
