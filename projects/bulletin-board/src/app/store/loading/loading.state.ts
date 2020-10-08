import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { LoadingStateModel, LOADING_STATE_TOKEN } from './loading-state.model';
import { Loading } from './loading.actions';

// https://medium.com/ngxs/ngxs-state-operators-8b339641b220
function setLoading(newValue: boolean) {
  return <T extends { loading: boolean }>(state: Readonly<T>) => {
    if (state?.loading === newValue) {
      return state;
    }
    return { loading: newValue };
  };
}

function startLoading() {
  return setLoading(true);
}

function finishLoading() {
  return setLoading(false);
}

const initialState = { loading: false };

@State<LoadingStateModel>({
  name: LOADING_STATE_TOKEN,
  defaults: initialState,
})
@Injectable()
export class LoadingState {
  readonly path: string;
  constructor() {
    this.path = LOADING_STATE_TOKEN.getName();
  }

  @Action(Loading.Start, { cancelUncompleted: true })
  actionLoadingStart$({ setState }: StateContext<LoadingStateModel>) {
    setState(startLoading());
  }

  @Action(Loading.Finish, { cancelUncompleted: true })
  actionLoadingFinish$({ setState }: StateContext<LoadingStateModel>) {
    setState(finishLoading());
  }
}
