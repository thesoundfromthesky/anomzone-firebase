import { Injectable } from '@angular/core';
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  ActivatedRoute,
} from '@angular/router';
import { Location } from '@angular/common';
import { filter, map, pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  root!: ActivatedRoute;
  path!: string;
  id!: string;
  fullPath!: string;
  constructor(
    private readonly router: Router,
    private readonly location: Location
  ) {
    this.root = this.router.routerState.root;
  }

  getUrl(absolute: boolean = true) {
    const path = this.router.url;
    return absolute ? path : path.slice(1);
  }

  /**
   *
   * @param route Current ActivatedRoute
   * @param absolute Make it absolute path or not default value is false
   */
  getParentPath(route: ActivatedRoute, absolute = false) {
    const path = route.parent?.routeConfig?.path as string;
    if (absolute) {
      return this.location.prepareExternalUrl(path);
    }
    return path;
  }

  getParamMap(route: ActivatedRoute, paramMapName: string) {
    const id = route.snapshot.paramMap.get(paramMapName);
    if (id) {
      return id;
    } else {
      throw Error('Param not found');
    }
  }

  getQueryParamMap(route: ActivatedRoute, queryParamMapName: string) {
    return route.snapshot.queryParamMap.get(queryParamMapName);
  }

  /**
   * Changes the browser's URL to a normalized version of the given URL, and replaces
   * the top item on the platform's history stack.
   * @param path — URL path to normalize.
   * @param query — Query parameters.
   * @param state — Location history state.
   */
  replaceState(path: string, query?: string | undefined, state?: any) {
    this.location.replaceState(path, query, state);
  }

  getResolved(route: ActivatedRoute) {
    return route.data.pipe(pluck('resolved'));
  }

  getFirstChildPath(route: ActivatedRoute, absolute = false) {
    const path = route.firstChild?.routeConfig?.path as string;

    if (absolute) {
      return this.location.prepareExternalUrl(path);
    }
    return path;
  }

  redirectTo(url: string) {
    url = this.location.prepareExternalUrl(url);
    this.router.navigateByUrl(url);
  }

  getRedirectUrl(route: ActivatedRoute) {
    const redirectUrl = this.getQueryParamMap(route, 'redirectUrl');
    return redirectUrl ? redirectUrl : '/';
  }

  getState(name: string) {
    console.log(this.router.getCurrentNavigation()?.extras.state);
    return this.router.getCurrentNavigation()?.extras.state?.[name];
  }

  isNavigationEnd$(): Observable<Event> {
    return this.router.events.pipe(
      filter((e: Event) => e instanceof NavigationEnd)
    );
  }

  anchorScroll(fragment: string) {
    this.router.navigate([], {
      fragment: fragment,
      skipLocationChange: true,
    });
  }

  isLoading$(): Observable<boolean> {
    return this.router.events.pipe(
      filter((e: Event) => {
        const lookupTable = {
          [NavigationStart.name]: true,
          [NavigationEnd.name]: true,
          [NavigationCancel.name]: true,
          [NavigationError.name]: true,
          default: false,
        };
        const name = e.constructor.name;
        return name in lookupTable ? lookupTable[name] : lookupTable.default;
      }),
      map((routerEvent: Event) => {
        if (routerEvent instanceof NavigationStart) {
          return true;
        }
        return false;
      })
    );
  }

  // Get url without parameters
  // https://stackoverflow.com/questions/42504809/get-current-route-without-parameters
  // const url = this.router.routerState.snapshot.url;
  // const urlTree = this.router.parseUrl(url);
  // const urlPath = urlTree.root.children['primary'].segments.map(
  //   (segment) => segment.path
  // );
  // if (this.route.snapshot.paramMap.get('id')) {
  //   urlPath.pop();
  // }
  // this.path = '/' + urlPath.join('/');
  // getPath(): string {
  //   const url = this.router.routerState.snapshot.url;
  //   const urlTree = this.router.parseUrl(url);
  //   const urlPath = urlTree.root.children['primary'].segments.map(
  //     (segment) => segment.path
  //   );
  //   if (this.route.snapshot.paramMap.get('id')) {
  //     urlPath.pop();
  //   }
  //   console.log(this.router.config[1].path);
  //   console.log(this.router);
  //   const path = '/' + urlPath.join('/');
  //   return path;
  // }
}
