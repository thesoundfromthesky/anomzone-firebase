import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { tap } from 'rxjs/operators';
import {
  MediaBreakpointsService,
  RouterService,
  TimerService,
} from '@src/app/core/util';
import { Observable } from 'rxjs';
import { Table } from 'primeng/table';
import { ActivatedRoute, Event } from '@angular/router';
import { PostsFacadeService, Post, PostsMap } from '@src/app/store/posts';
import { LoadingFacadeService } from '@src/app/store/loading';

@Component({
  selector: 'posts-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  // Virtual Scroll tutorial
  // https://www.youtube.com/watch?v=Ppl64MY6FFc

  @Input()
  rowIndex!: number;

  cols!: { field: string; header: string; width: string }[];
  posts$!: Observable<PostsMap>;
  isEnough!: boolean;
  rows!: number;

  table!: Table;
  mb$!: Observable<boolean>;

  router$!: Observable<Event>;
  loading$!: Observable<boolean>;

  absoluteParentPath!: string;
  relativeParentPath!: string;

  constructor(
    private readonly mb: MediaBreakpointsService,
    private readonly postsFacadeService: PostsFacadeService,
    private readonly rs: RouterService,
    private readonly loading: LoadingFacadeService,
    private readonly route: ActivatedRoute,
    private readonly timerService: TimerService
  ) {}

  ngOnInit(): void {
    this.router$ = this.rs.isNavigationEnd$().pipe(
      tap(() => {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
          this.backToTop();
        }
      })
    );
    this.loading$ = this.loading.selectLoading$();
    this.isEnough = false;
    this.rows = this.postsFacadeService.size;

    this.relativeParentPath = this.rs.getParentPath(this.route);
    this.absoluteParentPath = this.rs.getParentPath(this.route, true);

    this.mb$ = this.mb.observeBreakpoint('p-md');
    this.cols = [
      { field: 'title', header: 'Title', width: '100%' },
      { field: 'userId', header: 'Author', width: '15%' },
      { field: 'createdAt', header: 'Created At', width: '23%' },
    ];
    this.posts$ = this.postsFacadeService.initializePostsList$(
      this.relativeParentPath,
      this.rows
    );
  }

  trackByFn(i: number, v: Post) {
    return v?.id;
  }

  backToTop() {
    this.table.resetScrollTop();
  }

  reset() {
    this.timerService.run(() => {
      this.table.clearCache();
      this.isEnough = false;
      this.postsFacadeService.reinitializePostsList(
        this.relativeParentPath,
        this.rows
      );
    });
  }
  
  checkIfEnough(table: Table) {
    const pScroll = table.scrollableViewChild;
    const cdkScroll = pScroll.virtualScrollBody;
    const renderedContentSize = cdkScroll.measureRenderedContentSize();
    const viewportSize = cdkScroll.getViewportSize();

    if (viewportSize < renderedContentSize) {
      this.isEnough = true;
      this.tableInit = this.loadData;
    }
  }

  tableInit(table: Table) {
    if (this.table) return;
    this.table = table;
    if (this.rowIndex) {
      table.scrollToVirtualIndex(this.rowIndex);
    }
  }

  loadData() {
    if (!this.isEnough) {
      this.checkIfEnough(this.table);
    }

    this.postsFacadeService.dispatchPostsList$(
      this.relativeParentPath,
      this.rows
    );
  }
}
