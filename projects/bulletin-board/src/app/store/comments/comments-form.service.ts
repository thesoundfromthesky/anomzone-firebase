import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommentsFacadeService } from './comments-facade.service';
import { AuthFacadeService } from '../auth';
import { take } from 'rxjs/operators';
import { FormService } from '@src/app/core/util';
import { COMMENTS_STATE_TOKEN, Comment } from './comments-state.models';
import { CommentsValidators } from '@src/app/core/config';
import { FirestoreService } from '@src/app/core/firebase';

export type CommentsDefaults = Pick<Comment, 'content'>;

@Injectable({
  providedIn: 'root',
})
export class CommentsFormService {
  COMMENTS: 'comments';

  constructor(
    private readonly commentsFacadeService: CommentsFacadeService,
    private readonly auth: AuthFacadeService,
    private readonly formService: FormService,
    private readonly firestoreService: FirestoreService
  ) {
    this.COMMENTS = COMMENTS_STATE_TOKEN.getName() as 'comments';
  }

  getCommentsValidators(): CommentsValidators {
    return this.formService.getFormValidators(this.COMMENTS);
  }

  buildForm(comment?: Comment): FormGroup {
    const commentsForm = this.formService.buildForm(this.COMMENTS, comment);
    return commentsForm;
  }

  onCreate(form: FormGroup, rootPath: string, path: string, size: number) {
    form.markAllAsTouched();

    if (form.valid) {
      const timestamp = this.firestoreService.getTimestamp();

      form.value.userId = this.auth.getUid();
      form.value.createdAt = timestamp;
      form.value.updatedAt = timestamp;
      form.value.isDeleted = false;
      form.value.isVisible = true;

      this.commentsFacadeService
        .dispatchCommentsCreate$(path, form.value)
        .pipe(take(1))
        .subscribe({
          complete: () => {
            this.onReset(form);
            this.commentsFacadeService.reinitializeCommentsList(
              rootPath,
              path,
              size
            );
          },
        });
    }
  }

  onUpdate(
    form: FormGroup,
    rootPath: string,
    parentPath: string,
    path: string,
    size: number
  ) {
    form.markAllAsTouched();

    if (form.valid) {
      const timestamp = this.firestoreService.getTimestamp();

      form.value.updatedAt = timestamp;

      this.commentsFacadeService
        .dispatchCommentsUpdate$(path, form.value)
        .pipe(take(1))
        .subscribe({
          complete: () => {
            this.onReset(form);
            this.commentsFacadeService.reinitializeCommentsList(
              rootPath,
              parentPath,
              size
            );
          },
        });
    }
  }

  onDelete(rootPath: string, parentPath: string, path: string, size: number) {
    this.commentsFacadeService
      .dispatchCommentsDelete$(path)
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.commentsFacadeService.reinitializeCommentsList(
            rootPath,
            parentPath,
            size
          );
        },
      });
  }

  onReset(form: FormGroup, comment?: Comment) {
    let commentsFormDefaults;
    if (comment) {
      commentsFormDefaults = this.formService.getFormDefaults(
        this.COMMENTS,
        comment
      );
    }
    form.reset(commentsFormDefaults);
  }
}
