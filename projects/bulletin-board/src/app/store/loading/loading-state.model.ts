import { StateToken } from '@ngxs/store';

export interface LoadingStateModel {
  loading: boolean;
}

export const LOADING_STATE_TOKEN = new StateToken<LoadingStateModel>('loading');
