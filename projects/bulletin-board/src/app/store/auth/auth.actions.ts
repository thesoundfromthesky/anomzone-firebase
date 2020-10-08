import { AUTH_STATE_TOKEN, AuthStateModel } from './auth-state.models';

const prefix = `[${AUTH_STATE_TOKEN.getName()}]`;

export namespace Auth {
  export class Initialize {
    static readonly type = `${prefix} Initialize`;
    constructor() {}
  }

  export class Profile {
    static readonly type = `${prefix} User`;
    constructor(public readonly user: firebase.User) {}
  }

  export class SignOut {
    static readonly type = `${prefix} SignOut`;
    constructor() {}
  }

  export class SignInAnonymously {
    static readonly type = `${prefix} SignInAnonymously`;
    constructor() {}
  }

  export class SignInWithRedirect {
    static readonly type = `${prefix} SignInWithRedirect`;
    constructor(public readonly provider: firebase.auth.AuthProvider) {}
  }

  export class Reset {
    static readonly type = `${prefix} Reset`;
    constructor() {}
  }
}
