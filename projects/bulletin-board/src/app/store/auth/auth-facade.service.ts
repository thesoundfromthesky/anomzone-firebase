import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthProvider, AuthStateModel } from './auth-state.models';
import { Auth } from './auth.actions';
import { AuthSelectors } from './auth.selectors';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { RouterService, DocumentService } from '@src/app/core/util';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AuthFacadeService {
  constructor(
    private readonly store: Store,
    private readonly rs: RouterService,
    private readonly d: DocumentService
  ) {}

  getUid(): string {
    return this.store.selectSnapshot(({ auth }) => {
      return auth.uid;
    });
  }

  isOwner(uid: string): boolean {
    return this.getUid() === uid;
  }

  selectAuthProfile$(): Observable<AuthStateModel> {
    return this.store.select(AuthSelectors.profile());
  }

  dispatchAuthProfile$(user: firebase.User) {
    return this.store.dispatch(new Auth.Profile(user));
  }

  dispatchAuthReset$() {
    return this.store.dispatch(new Auth.Reset());
  }

  dispatchAuthInitialize$() {
    return this.store.dispatch(new Auth.Initialize());
  }

  dispatchAuthSignInAnonymously$(redirectUrl: string) {
    return this.store
      .dispatch(Auth.SignInAnonymously)
      .pipe(take(1))
      .subscribe(() => {
        this.rs.redirectTo(redirectUrl);
      });
  }

  dispatchAuthSignInWithRedirect$(provider: AuthProvider) {
    const authProvider = this.getAuthProvider(provider);
    return this.store.dispatch(
      new Auth.SignInWithRedirect(authProvider)
    );
  }

  getAuthProvider(
    provider: AuthProvider
  ): firebase.auth.GoogleAuthProvider | never {
    const lookupTable = {
      [AuthProvider.Google]: () => {
        return new auth.GoogleAuthProvider();
      },
      default: () => {
        throw Error('AuthProvider not found');
      },
    };
    return (lookupTable[provider] || lookupTable.default)();
  }

  dispatchAuthSignOut$() {
    return this.store
      .dispatch(Auth.SignOut)
      .pipe(take(1))
      .subscribe(() => {
        this.d.refreshToHome();
      });
  }
}
