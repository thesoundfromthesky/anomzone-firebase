import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  PostsFormService,
  Post,
  PostsFacadeService,
} from '@src/app/store/posts';
import { ActivatedRoute } from '@angular/router';
import { RouterService, TimerService } from '@src/app/core/util';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfirmationService } from 'primeng/api';
import { PostsValidators } from '@src/app/core/config';

@Component({
  selector: 'posts-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateComponent implements OnInit {
  postsForm!: FormGroup;
  postsValidators!: PostsValidators;
  post$!: Observable<Post>;
  valueChanges$!: Observable<any>;
  isUnchanged!: boolean;

  relativeParentPath!: string;
  id!: string;
  constructor(
    private readonly postsFormService: PostsFormService,
    private readonly postsFacadeService: PostsFacadeService,
    private readonly route: ActivatedRoute,
    private readonly rs: RouterService,
    private readonly cs: ConfirmationService,
    private readonly timerService: TimerService
  ) {}

  getPostsFormValue(control: string) {
    return this.postsForm.get(control)!.value;
  }

  ngOnInit(): void {
    this.relativeParentPath = this.rs.getParentPath(this.route);
    this.id = this.rs.getParamMap(this.route, 'id') as string;
    this.postsValidators = this.postsFormService.getPostsValidators();
    this.isUnchanged = true;
    this.post$ = this.rs.getResolved(this.route).pipe(
      tap((post) => {
        this.postsForm = this.postsFormService.getPostsForm(post);
        this.valueChanges$ = this.postsForm.valueChanges.pipe(
          tap(() => {
            this.isUnchanged = false;
          })
        );
      })
    );
  }

  onSubmit() {
    this.timerService.run(() => {
      this.postsFormService.onUpdate(
        this.postsForm,
        this.relativeParentPath,
        this.id,
        this.postsFacadeService.size
      );
    });
  }

  onReset(post: Post) {
    this.postsFormService.onReset(this.postsForm, post);
    this.isUnchanged = true;
  }

  onDelete() {
    this.cs.confirm({
      message: 'Are you sure that you want to delete this post?',
      accept: () => {
        this.postsFormService.onDelete(
          this.relativeParentPath,
          this.id,
          this.postsFacadeService.size
        );
      },
    });
  }
}
