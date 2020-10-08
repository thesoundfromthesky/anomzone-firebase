import { createSelector } from '@ngxs/store';
import { AUTH_STATE_TOKEN, AuthStateModel } from './auth-state.models';

export class AuthSelectors {
  static profile() {
    return createSelector(
      [AUTH_STATE_TOKEN],
      (state: AuthStateModel): AuthStateModel => {
        return state;
      }
    );
  }
}
