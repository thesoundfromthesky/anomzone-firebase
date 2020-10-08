import { StateToken } from '@ngxs/store';

export interface AuthStateModel {
  email: string;
  displayName: string;
  photoURL: string;
  uid: string;
  roles?: { member?: boolean };
  creationTime?: string;
  lastSignInTime?: string;
}

export const enum AuthProvider {
  Google = 'google',
}

export const AUTH_STATE_TOKEN = new StateToken<AuthStateModel>('auth');
