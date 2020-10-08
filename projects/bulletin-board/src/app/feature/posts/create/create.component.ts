import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostsValidators } from '@src/app/core/config';
import { RouterService, TimerService } from '@src/app/core/util';
import { PostsFacadeService, PostsFormService } from '@src/app/store/posts';

@Component({
  selector: 'posts-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateComponent implements OnInit {
  postsForm!: FormGroup;
  postsValidators!: PostsValidators;
  constructor(
    private readonly postsFacadeService: PostsFacadeService,
    private readonly postsFormService: PostsFormService,
    private readonly route: ActivatedRoute,
    private readonly rs: RouterService,
    private readonly timerService: TimerService
  ) {}

  getPostsFormValue(control: string) {
    return this.postsForm.get(control)!.value;
  }

  ngOnInit(): void {
    this.postsForm = this.postsFormService.getPostsForm();
    this.postsValidators = this.postsFormService.getPostsValidators();
  }

  onSubmit() {
    this.timerService.run(() => {
      this.postsFormService.onCreate(
        this.postsForm,
        this.rs.getParentPath(this.route),
        this.postsFacadeService.size
      );
    });
  }

  onReset() {
    this.postsFormService.onReset(this.postsForm);
  }
}
