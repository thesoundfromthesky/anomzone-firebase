import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '@src/app/core/util';
import {
  AuthFacadeService,
  AuthProvider,
  AuthStateModel,
} from '@src/app/store/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  user$!: Observable<AuthStateModel>;
  redirectUrl!: string;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly auth: AuthFacadeService,
    private readonly rs: RouterService
  ) {}

  ngOnInit(): void {
    this.redirectUrl = this.rs.getRedirectUrl(this.route);
  }

  signInAnonymously() {
    this.auth.dispatchAuthSignInAnonymously$(this.redirectUrl);
  }

  signInWithRedirectGoogle() {
    this.rs.replaceState('/login/callback', `?redirectUrl=${this.redirectUrl}`);
    this.auth.dispatchAuthSignInWithRedirect$(AuthProvider.Google);
  }
}
