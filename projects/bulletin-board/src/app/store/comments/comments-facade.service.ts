import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Comments } from './comments.actions';
import { Comment, COMMENTS_STATE_TOKEN } from './comments-state.models';
import { CommentsSelectors } from './comments.selectors';
import { take, switchMap, retry, map } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { ConfigService } from '@src/app/core/config';
import { KeyForms } from '@src/app/core/util';

@Injectable({
  providedIn: 'root',
})
export class CommentsFacadeService {
  size: number;
  constructor(
    private readonly store: Store,
    private readonly configService: ConfigService
  ) {
    const collectionName = COMMENTS_STATE_TOKEN.getName() as KeyForms;
    this.size = this.configService.forms[collectionName].batchSize;
  }

  selectCommentsList$(rootPath: string, path: string) {
    return this.store.select(CommentsSelectors.list(rootPath, path));
  }

  dispatchCommentsCreate$(path: string, form: Comment) {
    return this.store.dispatch(new Comments.Create(path, form));
  }

  dispatchCommentsList$(rootPath: string, path: string, size: number) {
    return this.store.dispatch(new Comments.List(rootPath, path, size));
  }

  dispatchCommentsUpdate$(path: string, form: Comment) {
    return this.store.dispatch(new Comments.Update(path, form));
  }

  dispatchCommentsDelete$(path: string) {
    return this.store.dispatch(new Comments.Delete(path));
  }

  dispatchCommentsReset$(rootPath: string, path: string) {
    return this.store.dispatch(new Comments.Reset(rootPath, path));
  }

  initializeCommentsList$(rootPath: string, path: string, size: number) {
    return this.selectCommentsList$(rootPath, path).pipe(
      switchMap((comments) => {
        if (!comments) {
          this.dispatchCommentsList$(rootPath, path, size);
          return throwError('Comments Empty');
        }
        return of(comments);
      }),
      retry(1),
      map((comments) => {
        return {
          ...comments,
          data: Object.values(comments.data),
        };
      })
    );
  }

  reinitializeCommentsList(rootPath: string, path: string, size: number) {
    this.dispatchCommentsReset$(rootPath, path)
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.dispatchCommentsList$(rootPath, path, size);
        },
      });
  }
}
