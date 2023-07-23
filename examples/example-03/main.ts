import { Step, StepSequence } from "../../modules/core/mod.ts";

type User = {
  email: string;
};

interface UserService {
  fetchUsers(): PromiseLike<User[]>;
}

class UserServiceImpl implements UserService {
  async fetchUsers(): Promise<User[]> {
    const res = await fetch(
      "https://randomuser.me/api/?" + new URLSearchParams({
        results: "10",
        seed: "dirigent",
      }),
    );
    const { results } = await res.json() as { results: User[] };
    return results;
  }
}

type State = {
  users: User[];
  emails: string[];
};

const initialState: State = {
  users: [],
  emails: [],
};

class GetUsersStep extends Step<State> {
  constructor(private userService: UserService) {
    super();
  }

  override async onRun(state: State): Promise<State> {
    const users = await this.userService.fetchUsers();
    return {
      ...state,
      users,
    };
  }
}

class GetEmailStep extends Step<State> {
  constructor(private readonly user: User) {
    super();
  }

  override onRun(state: State): State {
    state.emails.push(this.user.email);
    return state;
  }
}

class GetEmailsStep extends Step<State> {
  constructor() {
    super();
  }

  override async onRun(state: State): Promise<State> {
    return await new StepSequence(
      state.users.map((u) => new GetEmailStep(u)),
    ).execute(state);
  }
}

const steps = new StepSequence([
  new GetUsersStep(new UserServiceImpl()),
  new GetEmailsStep(),
]);

const finalState = await steps.execute(initialState);

console.table(finalState.emails);
