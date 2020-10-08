import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import {
  Comment,
  CommentsFacadeService,
  CommentsMap,
} from '@src/app/store/comments';
import { AuthFacadeService } from '@src/app/store/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'comments-get',
  templateUrl: './get.component.html',
  styleUrls: ['./get.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GetComponent implements OnInit {
  @Input() comment!: Comment;
  @Input() path!: string;
  @Input() rootPath!: string;
  @Input() parent!: string;
  @Input() layer!: number;
  
  showReply!: boolean;
  showEdit!: boolean;

  comments$!: Observable<CommentsMap>;

  size!: number;
  canContinue!: boolean;
  constructor(
    private readonly auth: AuthFacadeService,
    private readonly commentsFacadeService: CommentsFacadeService
  ) {}

  isOwner(userId: string) {
    return this.auth.isOwner(userId);
  }

  ngOnInit(): void {
    this.canContinue = false;
    this.size = this.commentsFacadeService.size;
    this.showReply = false;
    this.showEdit = false;
    this.comments$ = this.commentsFacadeService.initializeCommentsList$(
      this.rootPath,
      this.comment.path,
      this.size
    );
  }

  continue() {
    this.canContinue = true;
  }

  loadData() {
    this.commentsFacadeService.dispatchCommentsList$(
      this.rootPath,
      this.comment.path,
      this.size
    );
  }

  toggleShowReply() {
    this.showReply = !this.showReply;
    if (this.showReply) {
      this.showEdit = false;
    }
  }

  toggleEdit() {
    this.showEdit = !this.showEdit;
    if (this.showEdit) {
      this.showReply = false;
    }
  }
}
