import { COMMENTS_STATE_TOKEN, Comment } from './comments-state.models';

const prefix = `[${COMMENTS_STATE_TOKEN.getName()}]`;

export namespace Comments {
  export class Create {
    static readonly type = `${prefix} Create Comments`;
    constructor(public readonly path: string, public readonly form: Comment) {}
  }

  export class List {
    static readonly type = `${prefix} List Comments Collection`;
    constructor(public readonly rootPath:string,public readonly path: string, public readonly size: number) {}
  }

  export class Get {
    static readonly type = `${prefix} Get Comments Doc`;
    constructor() {}
  }

  export class Update {
    static readonly type = `${prefix} Update Comments Doc`;
    constructor(public readonly path: string, public readonly form: Comment) {}
  }

  export class Delete {
    static readonly type = `${prefix} Delete Comments Doc`;
    constructor(public readonly path: string) {}
  }

  export class Reset {
    static readonly type = `${prefix} Reset Comments`;
    constructor(public readonly rootPath:string,public readonly path: string) {}
  }
}
