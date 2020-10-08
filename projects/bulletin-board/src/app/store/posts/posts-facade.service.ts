import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, throwError, of } from 'rxjs';
import { Post, POSTS_STATE_TOKEN } from './posts-state.models';
import { Posts } from './posts.actions';
import { PostsSelectors } from './posts.selectors';
import { take, switchMap, retry, map, tap } from 'rxjs/operators';
import { ConfigService } from '@src/app/core/config';
import { KeyForms } from '@src/app/core/util';

@Injectable({ providedIn: 'root' })
export class PostsFacadeService {
  size: number;
  constructor(
    private readonly store: Store,
    private readonly configService: ConfigService
  ) {
    const collectionName = POSTS_STATE_TOKEN.getName() as KeyForms;
    this.size = this.configService.forms[collectionName].batchSize;
  }

  selectPostsGet$(path: string, id: string): Observable<Post> {
    return this.store.select(PostsSelectors.get(path, id));
  }

  selectPostsList$(path: string) {
    return this.store.select(PostsSelectors.list(path));
  }

  dispatchPostsGet$(path: string, id: string) {
    return this.store.dispatch(new Posts.Get(path, id));
  }

  dispatchPostsList$(path: string, size: number) {
    return this.store.dispatch(new Posts.List(path, size));
  }

  dispatchPostsCreate$(path: string, form: Post) {
    return this.store.dispatch(new Posts.Create(path, form));
  }

  dispatchPostsUpdate$(path: string, id: string, form: Post) {
    return this.store.dispatch(new Posts.Update(path, id, form));
  }

  dispatchPostsDelete$(path: string, id: string) {
    return this.store.dispatch(new Posts.Delete(path, id));
  }

  dispatchPostsReset$(path: string) {
    return this.store.dispatch(new Posts.Reset(path));
  }

  initializePostsList$(path: string, size: number) {
    return this.selectPostsList$(path).pipe(
      switchMap((posts) => {
        if (!posts) {
          this.dispatchPostsList$(path, size);
          return throwError('Posts Empty');
        }
        return of(posts);
      }),
      retry(1),
      tap((posts) => {
        if (
          posts.hasLoaded &&
          !posts.isEnd &&
          Object.keys(posts.data).length < 2
        ) {
          this.dispatchPostsList$(path, size);
        }
      }),
      map((posts) => {
        if (posts.isEnd) {
          return {
            ...posts,
            data: Object.values(posts.data),
          };
        }
        return {
          ...posts,
          data: [...Object.values(posts.data), ...Array(size)],
        };
      })
    );
  }

  reinitializePostsList(path: string, size: number) {
    this.dispatchPostsReset$(path)
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.dispatchPostsList$(path, size);
        },
      });
  }
}
