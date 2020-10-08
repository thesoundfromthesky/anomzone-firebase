import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  CommentsFacadeService,
  CommentsFormService,
} from '@src/app/store/comments';
import { Comment } from '@src/app/store/comments';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { tap } from 'rxjs/operators';
import { CommentsValidators } from '@src/app/core/config';
import { RouterService, TimerService } from '@src/app/core/util';

@Component({
  selector: 'comments-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateComponent implements OnInit {
  @Input() comment!: Comment;
  @Input() path!: string;
  @Input() parentPath!: string;
  @Input() rootPath!: string;
  @Input() id!: string;
  @Output() toggleEdit: EventEmitter<void> = new EventEmitter<void>();

  commentsForm!: FormGroup;

  commentsValidators!: CommentsValidators;

  valueChanges$!: Observable<any>;
  isUnchanged!: boolean;

  constructor(
    private readonly commentsFormService: CommentsFormService,
    private readonly commentsFacadeService: CommentsFacadeService,
    private readonly cs: ConfirmationService,
    private readonly timerService: TimerService,
    private readonly rs: RouterService
  ) {}

  getFormValue(control: string) {
    return this.commentsForm.get(control)?.value;
  }

  ngOnInit(): void {
    this.isUnchanged = true;
    this.commentsForm = this.commentsFormService.buildForm(this.comment);
    this.commentsValidators = this.commentsFormService.getCommentsValidators();

    this.valueChanges$ = this.commentsForm.valueChanges.pipe(
      tap(() => {
        this.isUnchanged = false;
      })
    );
  }

  onSubmit() {
    this.timerService.run(() => {
      this.commentsFormService.onUpdate(
        this.commentsForm,
        this.rootPath,
        this.parentPath,
        this.path,
        this.commentsFacadeService.size
      );
      this.rs.anchorScroll(this.comment.id);
      this.toggleEdit.emit();
    });
  }

  onDelete() {
    this.cs.confirm({
      message: 'Are you sure that you want to hide this comment?',
      accept: () => {
        this.commentsFormService.onDelete(
          this.rootPath,
          this.parentPath,
          this.path,
          this.commentsFacadeService.size
        );
        this.rs.anchorScroll(this.comment.id);
        this.toggleEdit.emit();
      },
    });
  }

  onReset() {
    this.commentsFormService.onReset(this.commentsForm, this.comment);
    this.isUnchanged = true;
  }
}
