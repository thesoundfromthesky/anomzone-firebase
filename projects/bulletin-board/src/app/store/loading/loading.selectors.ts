import { createSelector } from '@ngxs/store';
import { LOADING_STATE_TOKEN, LoadingStateModel } from './loading-state.model';

export class LoadingSelectors {
  static loading() {
    return createSelector(
      [LOADING_STATE_TOKEN],
      (state: LoadingStateModel): boolean => {
        return state.loading;
      }
    );
  }
}
