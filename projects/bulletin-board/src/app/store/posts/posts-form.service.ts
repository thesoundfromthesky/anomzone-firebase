import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PostsFacadeService } from './posts-facade.service';
import { take } from 'rxjs/operators';
import { FormService, RouterService } from '@src/app/core/util';
import { AuthFacadeService } from '@src/app/store/auth';
import { Post, POSTS_STATE_TOKEN } from './posts-state.models';
import { PostsValidators } from '@src/app/core/config';
import { FirestoreService } from '@src/app/core/firebase';

export type PostsDefaults = Pick<Post, 'title' | 'content'>;

@Injectable({
  providedIn: 'root',
})
export class PostsFormService {
  POSTS: 'posts';
  constructor(
    private readonly postsFacadeService: PostsFacadeService,
    private readonly rs: RouterService,
    private readonly auth: AuthFacadeService,
    private readonly formService: FormService,
    private readonly firestoreService: FirestoreService
  ) {
    this.POSTS = POSTS_STATE_TOKEN.getName() as 'posts';
  }

  getPostsValidators(): PostsValidators {
    return this.formService.getFormValidators(this.POSTS);
  }

  getPostsForm(post?: Post): FormGroup {
    const postsForm = this.formService.buildForm(this.POSTS, post);
    return postsForm;
  }

  onCreate(form: FormGroup, path: string, size: number) {
    // for (let control in this.form.value) {
    //   this.form.controls[control].markAsDirty();
    // }


    form.markAllAsTouched();

    if (form.valid) {
      const timestamp = this.firestoreService.getTimestamp();

      form.value.userId = this.auth.getUid();
      form.value.createdAt = timestamp;
      form.value.updatedAt = timestamp;
      form.value.isDeleted = false;

      this.postsFacadeService
        .dispatchPostsCreate$(path, form.value)
        .pipe(take(1))
        .subscribe({
          complete: () => {
            this.postsFacadeService.reinitializePostsList(path, size);
            this.rs.redirectTo(path);
          },
        });
    }
  }

  onUpdate(form: FormGroup, path: string, id: string, size: number) {
    // for (let control in this.form.value) {
    //   this.form.controls[control].markAsDirty();
    // }

    form.markAllAsTouched();

    if (form.valid) {
      const timestamp = this.firestoreService.getTimestamp();

      form.value.updatedAt = timestamp;

      this.postsFacadeService
        .dispatchPostsUpdate$(path, id, form.value)
        .pipe(take(1))
        .subscribe({
          complete: () => {
            this.postsFacadeService.reinitializePostsList(path, size);
            this.rs.redirectTo(path);
          },
        });
    }
  }

  onDelete(path: string, id: string, size: number) {
    this.postsFacadeService
      .dispatchPostsDelete$(path, id)
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.postsFacadeService.reinitializePostsList(path, size);
          this.rs.redirectTo(path);
        },
      });
  }

  onReset(form: FormGroup, post?: Post) {
    let postsFormDefaults;
    if (post) {
      postsFormDefaults = this.formService.getFormDefaults(this.POSTS, post);
    }
    form.reset(postsFormDefaults);
  }
}
