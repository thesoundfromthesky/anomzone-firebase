import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '@src/app/core/util';
import { AuthFacadeService, AuthStateModel } from '@src/app/store/auth';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'auth-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallbackComponent implements OnInit {
  user$!: Observable<AuthStateModel>;
  redirectUrl!: string;
  constructor(
    private readonly rs: RouterService,
    private readonly route: ActivatedRoute,
    private readonly auth: AuthFacadeService
  ) {}

  ngOnInit(): void {
    this.user$ = this.auth.selectAuthProfile$().pipe(
      tap((user) => {
        if (user.uid) {
          this.redirectUrl = this.rs.getRedirectUrl(this.route);
          this.rs.redirectTo(this.redirectUrl);
        }
      })
    );
  }
}
