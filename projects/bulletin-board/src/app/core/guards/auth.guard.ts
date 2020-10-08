import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthFacadeService } from '@src/app/store/auth';
import { map, skipWhile, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  first: boolean;
  constructor(
    private readonly router: Router,
    private readonly auth: AuthFacadeService
  ) {
    this.first = true;
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const redirectTo = () => {
      return this.router.parseUrl('/login?redirectUrl=' + state.url);
    };

    return this.auth.selectAuthProfile$().pipe(
      skipWhile((user) => {
        return !('uid' in user);
      }),
      take(1),
      map((user) => {
        if (!user.uid) {
          return redirectTo();
        }

        return true;
      })
    );
  }
}

export function canActiveAuthGuard() {
  return { canActivate: [AuthGuard] };
}
