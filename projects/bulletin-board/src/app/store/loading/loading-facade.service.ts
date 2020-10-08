import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LoadingSelectors } from './loading.selectors';
import { Loading } from './loading.actions';

@Injectable({
  providedIn: 'root',
})
export class LoadingFacadeService {
  constructor(private readonly store: Store) {}

  selectLoading$(): Observable<boolean> {
    return this.store.select(LoadingSelectors.loading());
  }

  dispatchLoadingStart$() {
    return this.store.dispatch(Loading.Start);
  }

  dispatchLoadingFinish$() {
    return this.store.dispatch(Loading.Finish);
  }
}
