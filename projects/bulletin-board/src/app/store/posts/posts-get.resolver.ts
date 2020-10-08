import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Post } from './posts-state.models';
import { PostsFacadeService } from './posts-facade.service';
import { Observable } from 'rxjs';
import { tap, skipWhile, take } from 'rxjs/operators';
import { AuthFacadeService } from '../auth';
import { RouterService } from '@src/app/core/util';
@Injectable({ providedIn: 'root' })
export class PostsGetResolver implements Resolve<Post> {
  constructor(
    private readonly pfs: PostsFacadeService,
    private readonly auth: AuthFacadeService,
    private readonly rs: RouterService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Post> | Promise<Post> | Post {

    const path = route.parent?.routeConfig?.path;
    const id = route.paramMap.get('id');

    if (!path || !id) {
      throw Error("Path or Id not found");
    }

    return this.pfs.selectPostsGet$(path, id).pipe(
      tap((post) => {
        if (!post) {
          this.pfs.dispatchPostsGet$(path, id);
          return;
        }
        if (route.data.isOwner && !this.auth.isOwner(post.userId)) {
          this.rs.redirectTo('/');
        }
      }),
      skipWhile((post) => !post),
      take(1)
    );
  }
}
export function resolvePostsGet({ isOwner = false } = {}) {
  return { resolve: { resolved: PostsGetResolver }, data: { isOwner } };
}
