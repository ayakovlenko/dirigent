import { Step } from "../../core/mod.ts";

abstract class FsPersistedStep<S> extends Step<S> {
  constructor(private path: string) {
    super();
  }

  onStateChanged(_oldState: S, newState: S): Promise<void> {
    return Deno.writeTextFile( // TODO: just await?
      this.path,
      JSON.stringify(newState),
    );
  }
}

export { FsPersistedStep };
