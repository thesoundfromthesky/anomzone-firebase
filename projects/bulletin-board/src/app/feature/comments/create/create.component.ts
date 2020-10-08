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
import { FormGroup } from '@angular/forms';
import { TimerService } from '@src/app/core/util';
import { CommentsValidators } from '@src/app/core/config';

@Component({
  selector: 'comments-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateComponent implements OnInit {
  commentsForm!: FormGroup;
  commentsValidators!: CommentsValidators;
  @Input() path!: string;
  @Input() rootPath!: string;
  @Input() header!: string;
  @Input() id!:string;
  @Output() toggleShowReply: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private readonly commentsFormService: CommentsFormService,
    private readonly commentsFacadeService: CommentsFacadeService,
    private readonly timerService: TimerService
  ) {}

  getFormValue(control: string) {
    return this.commentsForm.get(control)?.value;
  }

  ngOnInit(): void {
    this.commentsForm = this.commentsFormService.buildForm();
    this.commentsValidators = this.commentsFormService.getCommentsValidators();
  }

  onSubmit() {
    this.timerService.run(() => {
      this.commentsFormService.onCreate(
        this.commentsForm,
        this.rootPath,
        this.path,
        this.commentsFacadeService.size
      );
      this.toggleShowReply.emit();
    });
  }

  onReset() {
    this.commentsFormService.onReset(this.commentsForm);
  }
}
