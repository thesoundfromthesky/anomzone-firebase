import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { AUTH_STATE_TOKEN, AuthStateModel } from './auth-state.models';
import { Auth } from './auth.actions';
import { AngularFireAuth } from '@angular/fire/auth';
import { Loading, LoadingFacadeService } from '../loading';
import { take, tap } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';

const initialState = {
  uid: '',
  email: '',
  photoURL: '',
  displayName: '',
  roles: undefined,
  creationTime: '',
  lastSignInTime: '',
};

@State<AuthStateModel>({
  name: AUTH_STATE_TOKEN,
  defaults: undefined,
})
@Injectable()
export class AuthState implements Loading {
  readonly path: string;
  constructor(
    private readonly auth: AngularFireAuth,
    private readonly loading: LoadingFacadeService,
    private fns: AngularFireFunctions
  ) {
    this.path = AUTH_STATE_TOKEN.getName();
  }

  startLoading(): void {
    this.loading.dispatchLoadingStart$();
  }

  finishLoading(): void {
    this.loading.dispatchLoadingFinish$();
  }

  @Action(Auth.Initialize, { cancelUncompleted: true })
  actionAuthInitialize$({ dispatch }: StateContext<AuthStateModel>) {
    this.auth.authState
      .pipe(
        tap((user) => {
          if (user) {
            return dispatch(new Auth.Profile(user));
          } else {
            return dispatch(new Auth.Reset());
          }
        })
      )
      .subscribe();

  }

  @Action(Auth.Profile, { cancelUncompleted: true })
  actionAuthUser$(
    { setState }: StateContext<AuthStateModel>,
    { user }: Auth.Profile
  ) {
    return this.auth.idTokenResult.pipe(
      tap(async (idTokenResult) => {
        const callable = this.fns.httpsCallable('callableFn');
        const data$ = callable({});
        data$.pipe(take(1)).subscribe(console.log);
 
        const {
          email,
          uid,
          displayName,
          photoURL,
          metadata: { creationTime, lastSignInTime },
        } = user;

        setState({
          email,
          uid,
          displayName,
          photoURL,
          roles: { member: idTokenResult?.claims.member },
          creationTime,
          lastSignInTime,
        } as AuthStateModel);
      })
    );
  }

  @Action(Auth.SignInAnonymously, { cancelUncompleted: true })
  async actionAuthSignInAnonymously$({
    dispatch,
  }: StateContext<AuthStateModel>) {
    this.startLoading();
    const { user } = await this.auth.signInAnonymously();
    if (user) {
      dispatch(new Auth.Profile(user));
    }

    this.finishLoading();
  }

  @Action(Auth.SignInWithRedirect, { cancelUncompleted: true })
  async actionAuthSignInWithRedirect$(
    ctx: StateContext<AuthStateModel>,
    { provider }: Auth.SignInWithRedirect
  ) {
    this.startLoading();

    await this.auth.signInWithRedirect(provider);

    this.finishLoading();
  }

  @Action(Auth.SignOut, { cancelUncompleted: true })
  async actionAuthSignOut$() {
    this.startLoading();
    await this.auth.signOut();
    this.finishLoading();
  }

  @Action(Auth.Reset, { cancelUncompleted: true })
  actionAuthReset$({ setState }: StateContext<AuthStateModel>) {
    this.startLoading();
    setState(initialState);
    this.finishLoading();
  }
}
