import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '@src/app/store/posts';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthFacadeService } from '@src/app/store/auth';
import { RouterService } from '@src/app/core/util';

@Component({
  selector: 'posts-get',
  templateUrl: './get.component.html',
  styleUrls: ['./get.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GetComponent implements OnInit {
  post$!: Observable<Post>;
  rowIndex!: number;
  isOwner!: boolean;
  path!: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly auth: AuthFacadeService,
    private readonly rs: RouterService
  ) {
    this.rowIndex = this.rs.getState('rowIndex');
  }

  ngOnInit() {
    this.path = this.rs.getUrl();
    this.post$ = this.rs.getResolved(this.route).pipe(
      tap((post) => {
        this.isOwner = this.auth.isOwner(post.userId);
      })
    );
  }
}
