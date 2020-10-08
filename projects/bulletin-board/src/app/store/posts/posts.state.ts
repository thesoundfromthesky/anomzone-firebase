import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { tap, map } from 'rxjs/operators';
import {
  PostsStateModel,
  Post,
  POSTS_STATE_TOKEN,
  PostsCollection,
} from './posts-state.models';
import { FirestoreService } from '@src/app/core/firebase';
import { Posts } from './posts.actions';
import { patch } from '@ngxs/store/operators';
import { LoadingFacadeService, Loading } from '../loading';
import { firestore } from 'firebase/app';

const initialState = { data: {}, isEnd: false, hasLoaded: false };

@State<PostsStateModel>({
  name: POSTS_STATE_TOKEN,
  defaults: {},
})
@Injectable()
export class PostsState implements Loading {
  constructor(
    private readonly db: FirestoreService,
    private readonly loading: LoadingFacadeService
  ) {}

  getCollectionPath(path: string, id?: string) {
    const fullPath = `rootPosts/${path}/${POSTS_STATE_TOKEN.getName()}`;

    if (id) {
      return `${fullPath}/${id}`;
    }

    return fullPath;
  }

  startLoading(): void {
    this.loading.dispatchLoadingStart$();
  }

  finishLoading(): void {
    this.loading.dispatchLoadingFinish$();
  }

  initState(path: string) {
    return <T>(state: Readonly<{ [key: string]: T }>) => {
      if (state[path]) {
        return state;
      } else {
        return { ...state, [path]: initialState };
      }
    };
  }

  @Action(Posts.List, { cancelUncompleted: true })
  actionPostsList$(
    { setState, getState }: StateContext<PostsStateModel>,
    { path, size }: Posts.List
  ) {
    this.startLoading();
    let isEnd = false;
    setState(this.initState(path));

    return this.db
      .colGet$<Post>(this.getCollectionPath(path), (ref) => {
        let query = ref
          .where('isDeleted', '==', false)
          .orderBy('createdAt', 'desc');

        const state = getState();
        const cursor = Object.values(state[path].data).pop();
        query = cursor ? query.startAfter(cursor.doc()) : query;

        return query.limit(size);
      })
      .pipe(
        map((arr) => {
          isEnd = arr.length < size;
          return arr.reduce(
            (acc, cur) => ({ ...acc, [cur.id]: cur }),
            {} as Pick<PostsCollection, 'data'>
          );
        }),
        tap((v) => {
          setState(
            patch({
              [path]: patch({ data: patch(v), isEnd, hasLoaded: true }),
            })
          );
          this.finishLoading();
        })
      );
  }

  @Action(Posts.Get, { cancelUncompleted: true })
  actionPostsGet$(
    { setState }: StateContext<PostsStateModel>,
    { path, id }: Posts.Get
  ) {
    this.startLoading();
    setState(this.initState(path));
    return this.db.docGet$<Post>(this.getCollectionPath(path, id)).pipe(
      map((arr) => {
        return { [arr.id]: arr };
      }),
      tap((v) => {
        setState(
          patch({
            [path]: patch({
              data: patch(v),
              isEnd: false,
              hasLoaded: true,
            }),
          })
        );
        this.finishLoading();
      })
    );
  }

  @Action(Posts.Create, { cancelUncompleted: true })
  actionPostsCreate$(
    ctx: StateContext<PostsStateModel>,
    { path, form }: Posts.Create
  ) {
    this.startLoading();
    return this.db.colAdd<Post>(this.getCollectionPath(path), form).then(() => {
      this.finishLoading();
    });
  }

  @Action(Posts.Update, { cancelUncompleted: true })
  actionPostsUpdate$(
    ctx: StateContext<PostsStateModel>,
    { path, id, form }: Posts.Update
  ) {
    this.startLoading();
    return this.db
      .docSet<Post>(this.getCollectionPath(path, id), form)
      .then(() => {
        this.finishLoading();
      });
  }

  @Action(Posts.Delete, { cancelUncompleted: true })
  actionPostsDelete$(
    ctx: StateContext<PostsStateModel>,
    { path, id }: Posts.Delete
  ) {
    this.startLoading();
    const timestamp = firestore.FieldValue.serverTimestamp() as Timestamp;
    return this.db
      .docSet<Partial<Post>>(this.getCollectionPath(path, id), {
        isDeleted: true,
        updatedAt: timestamp,
      })
      .then(() => {
        this.finishLoading();
      });
  }

  @Action(Posts.Reset, { cancelUncompleted: true })
  actionPostsReset$(
    { patchState }: StateContext<PostsStateModel>,
    { path }: Posts.Reset
  ) {
    this.startLoading();
    patchState({ [path]: initialState });
    this.finishLoading();
  }
}
