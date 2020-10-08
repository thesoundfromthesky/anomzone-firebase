import { Injectable } from '@angular/core';
import {
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
} from '@angular/router';

// https://medium.com/javascript-in-plain-english/angular-route-reuse-strategy-b5d40adce841
// https://stackoverflow.com/questions/49155895/how-to-activate-routereusestrategy-only-for-specific-routes

@Injectable()
export class CustomRouteReuseStategyService implements RouteReuseStrategy {
  handlers: { [key: string]: DetachedRouteHandle | null } = {};

  constructor() {}

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data.shouldReuse || false;
  }

  store(
    route: ActivatedRouteSnapshot,
    handle: DetachedRouteHandle | null
  ): void {
    if (route.data.shouldReuse && route?.routeConfig?.path) {
      this.handlers[route.routeConfig.path] = handle;
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return (
      !!route?.routeConfig?.path && !!this.handlers[route?.routeConfig?.path]
    );
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.routeConfig) return null;
    return !!route?.routeConfig?.path && this.handlers[route.routeConfig.path];
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.data.shouldReuse || false;
  }
}

export const customRouteReuseStategyProvider = {
  provide: RouteReuseStrategy,
  useClass: CustomRouteReuseStategyService,
};
