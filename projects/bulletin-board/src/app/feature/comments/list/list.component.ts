import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { RouterService } from '@src/app/core/util';
import { Comment } from '@src/app/store/comments';

@Component({
  selector: 'comments-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  @Input() path!: string;
  @Input() rootPath!: string;
  @Input() parent!: string;
  @Input() layer!: number;
  @Input() comments!: Comment[];

  constructor(private readonly rs: RouterService) {}

  ngOnInit(): void {

  }
}
