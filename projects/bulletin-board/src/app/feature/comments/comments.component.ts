import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterService, TimerService } from '@src/app/core/util';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { CommentsFacadeService, CommentsMap } from '@src/app/store/comments';
import { PostsState } from '@src/app/store/posts';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsComponent implements OnInit {
  rootPath!: string;
  path!: string;
  comments$!: Observable<CommentsMap>;
  paramMap$!: Observable<ParamMap>;
  size!: number;

  constructor(
    private readonly rs: RouterService,
    private readonly route: ActivatedRoute,
    private readonly commentsFacadeService: CommentsFacadeService,
    private readonly postsState: PostsState,
    private readonly timerService: TimerService
  ) {}

  ngOnInit(): void {
    this.size = this.commentsFacadeService.size;
    this.paramMap$ = this.route.paramMap.pipe(
      tap((params: ParamMap) => {
        this.path = this.postsState.getCollectionPath(
          this.rs.getParentPath(this.route),
          params.get('id')!
        );
        this.rootPath = this.path;
        this.comments$ = this.commentsFacadeService.initializeCommentsList$(
          this.rootPath,
          this.path,
          this.size
        );
      })
    );
  }

  reset() {
    this.timerService.run(() => {
      this.commentsFacadeService.reinitializeCommentsList(
        this.rootPath,
        this.path,
        this.size
      );
    });
  }

  loadData() {
    this.commentsFacadeService.dispatchCommentsList$(
      this.rootPath,
      this.path,
      this.size
    );
  }
}
