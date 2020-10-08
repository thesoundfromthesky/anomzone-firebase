import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import {
  CommentsCollection,
  Comment,
  COMMENTS_STATE_TOKEN,
  CommentsStateModel,
} from './comments-state.models';
import { FirestoreService } from '@src/app/core/firebase';
import { Comments } from './comments.actions';
import { patch } from '@ngxs/store/operators';
import { LoadingFacadeService, Loading } from '../loading';
import { map, tap } from 'rxjs/operators';

const initialState = { data: {}, isEnd: true };

@State<CommentsStateModel>({
  name: COMMENTS_STATE_TOKEN,
  defaults: {},
})
@Injectable()
export class CommentsState implements Loading {
  getCollectionPath(path: string) {
    return `${path}/${COMMENTS_STATE_TOKEN.getName()}`;
  }

  constructor(
    private readonly db: FirestoreService,
    private readonly loading: LoadingFacadeService
  ) { }

  startLoading(): void {
    this.loading.dispatchLoadingStart$();
  }

  finishLoading(): void {
    this.loading.dispatchLoadingFinish$();
  }

  initState(rootPath: string, path: string) {
    return <T>(state: Readonly<{ [key: string]: { [key: string]: T } }>) => {
      if (state[rootPath]?.[path]) {
        return state;
      } else {
        return {
          ...state,
          [rootPath]: { ...state[rootPath], [path]: initialState },
        };
      }
    };
  }

  @Action(Comments.Create, { cancelUncompleted: true })
  actionCommentsCreate$(
    ctx: StateContext<CommentsStateModel>,
    { path, form }: Comments.Create
  ) {
    this.startLoading();
    return this.db
      .colAdd<Comment>(this.getCollectionPath(path), form)
      .then(() => {
        this.finishLoading();
      });
  }

  @Action(Comments.List, { cancelUncompleted: false })
  actionCommentsList$(
    { setState, getState }: StateContext<CommentsStateModel>,
    { rootPath, path, size }: Comments.List
  ) {
    this.startLoading();
    let isEnd = false;

    setState(this.initState(rootPath, path));

    return this.db
      .colGet$<Comment>(this.getCollectionPath(path), (ref) => {
        let query = ref
          .where('isDeleted', '==', false)
          .orderBy('createdAt', 'asc');

        const state = getState();
        const cursor = Object.values(state[rootPath][path].data).pop();
        query = cursor ? query.startAfter(cursor.doc()) : query;

        return query.limit(size);
      })
      .pipe(
        map((arr) => {
          isEnd = arr.length < size;
          return arr.reduce(
            (acc, cur) => ({ ...acc, [cur.id]: cur }),
            {} as Pick<CommentsCollection, 'data'>
          );
        }),
        tap((v) => {
          setState(
            patch({
              [rootPath]: patch({
                [path]: patch({ data: patch(v), isEnd }),
              }),
            })
          );
          this.finishLoading();
        })
      );
  }

  //   @Action(Posts.Get, { cancelUncompleted: true })
  //   actionPostsGet$({ setState }: StateContext<PostsStateModel>) {
  //     this.startLoading();
  //     return this.db.docGet$<Post>(`${this.path}/${this.id}`).pipe(
  //       map((arr) => {
  //         return { [arr.id]: arr };
  //       }),
  //       tap((v) => {
  //         setState(
  //           patch({
  //             [this.path]: patch({ data: patch(v) }),
  //           })
  //         );
  //         this.finishLoading();
  //       })
  //     );
  //   }

  @Action(Comments.Update, { cancelUncompleted: true })
  actionCommentsUpdate$(
    ctx: StateContext<CommentsStateModel>,
    { path, form }: Comments.Update
  ) {
    this.startLoading();
    return this.db.docSet<Comment>(path, form).then(() => {
      this.finishLoading();
    });
  }

  @Action(Comments.Delete, { cancelUncompleted: true })
  actionCommentsDelete$(
    ctx: StateContext<CommentsStateModel>,
    { path }: Comments.Delete
  ) {
    this.startLoading();

    const timestamp = this.db.getTimestamp();
    return this.db
      .docSet<Partial<Comment>>(path, {
        isVisible: false,
        updatedAt: timestamp,
      })
      .then(() => {
        this.finishLoading();
      });
  }

  @Action(Comments.Reset, { cancelUncompleted: true })
  actionPostsReset$(
    { setState }: StateContext<CommentsStateModel>,
    { rootPath, path }: Comments.Reset
  ) {
    this.startLoading();
    setState(
      patch({
        [rootPath]: patch({
          [path]: initialState,
        }),
      })
    );
    this.finishLoading();
  }
}
