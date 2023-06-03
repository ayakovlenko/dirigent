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
