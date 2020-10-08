import { LOADING_STATE_TOKEN } from './loading-state.model';

const prefix = `[${LOADING_STATE_TOKEN.getName()}]`;

export namespace Loading {
  export class Start {
    static readonly type = `${prefix} Start Loading`;
    constructor() {}
  }

  export class Finish {
    static readonly type = `${prefix} Finish Loading`;
    constructor() {}
  }
}
