import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { MediaBreakpointsService, TimerService } from '@src/app/core/util';
import { LoadingFacadeService } from '@src/app/store/loading';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent implements OnInit {
  @Input() label!: string;
  @Input() styleClass!:
    | string
    | string[]
    | Set<string>
    | { [klass: string]: any };
  @Input() icon!: string;

  @Input() cb!: ($event?: Event) => void;

  @Input() delay: boolean;
  @Input() loading: boolean;
  @Input() invalid: boolean;
  @Input() isUnchanged: boolean;
  @Input() isEnd!: boolean;
  @Input() isResponsive: boolean;
  loading$!: Observable<boolean>;
  delay$!: Observable<number>;
  mb$!: Observable<boolean>;
  constructor(
    private readonly loadingService: LoadingFacadeService,
    private readonly timerService: TimerService,
    private readonly mb: MediaBreakpointsService
  ) {
    this.delay = false;
    this.loading = false;
    this.invalid = false;
    this.isUnchanged = false;
    this.isEnd = false;
    this.isResponsive = true;
  }

  ngOnInit(): void {
    this.mb$ = this.mb.observeBreakpoint('p-md');
    this.delay$ = this.timerService.delay$;
    this.loading$ = this.loadingService.selectLoading$();
  }

  canDisable(delay: number, loading: boolean) {
    if (this.delay && delay) {
      return true;
    }

    if (this.loading && loading) {
      return true;
    }

    if (this.invalid) {
      return true;
    }

    if (this.isUnchanged) {
      return true;
    }

    if (this.isEnd) {
      return true;
    }
    return false;
  }

  getLabel(delay: number) {
    if (this.delay) {
      return delay ? delay.toString() : this.label;
    }
    return this.label;
  }

  getIcon(delay: number, loading: boolean) {
    if (this.delay && this.loading) {
      return delay || loading ? 'pi pi-spin pi-spinner' : this.icon;
    }

    if (this.loading) {
      return loading ? 'pi pi-spin pi-spinner' : this.icon;
    }

    return this.icon;
  }
}
