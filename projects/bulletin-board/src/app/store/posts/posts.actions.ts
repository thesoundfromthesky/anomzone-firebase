import { Post, POSTS_STATE_TOKEN } from './posts-state.models';

const prefix = `[${POSTS_STATE_TOKEN.getName()}]`;

export namespace Posts {
  export class Create {
    static readonly type = `${prefix} Create Posts`;
    constructor(public readonly path: string, public readonly form: Post) {}
  }

  export class List {
    static readonly type = `${prefix} List Posts Collection`;
    constructor(public readonly path: string, public readonly size: number) {}
  }

  export class Get {
    static readonly type = `${prefix} Get Posts Doc`;
    constructor(public readonly path: string, public readonly id: string) {}
  }

  export class Update {
    static readonly type = `${prefix} Update Posts Doc`;
    constructor(
      public readonly path: string,
      public readonly id: string,
      public readonly form: Post
    ) {}
  }

  export class Delete {
    static readonly type = `${prefix} Delete Posts Doc`;
    constructor(public readonly path: string, public readonly id: string) {}
  }

  export class Reset {
    static readonly type = `${prefix} Reset Posts`;
    constructor(public readonly path: string) {}
  }
}
