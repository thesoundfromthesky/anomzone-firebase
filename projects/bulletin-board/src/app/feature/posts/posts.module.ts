import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@src/app/shared';
import { CreateComponent } from './create/create.component';
import { GetComponent } from './get/get.component';
import { ListComponent } from './list/list.component';
import { UpdateComponent } from './update/update.component';
import { PostsRoutingModule } from './posts-routing.module';
import { NgxsModule } from '@ngxs/store';
import { PostsState } from '@src/app/store/posts';
import { CommentsState } from '@src/app/store/comments';
import { CommentsModule } from '@src/app/feature/comments';
import { environment } from '@src/environments/environment';
import { canActiveAuthGuard } from '@src/app/core/guards';
import { Route } from '@angular/router';

@NgModule({
  declarations: [CreateComponent, GetComponent, ListComponent, UpdateComponent],
  imports: [
    CommonModule,
    PostsRoutingModule,
    SharedModule,
    CommentsModule,
    NgxsModule.forFeature([PostsState, CommentsState]),
  ],
})
export class PostsModule {}

export function loadChildrenPostsModule(): Route[] {
  const routes: Route[] = [];
  const menus = environment.menus;
  for (const menu in menus) {
    menus[menu as keyof typeof menus].forEach((item) => {
      routes.push({
        path: item,
        ...canActiveAuthGuard(),
        loadChildren: async () =>
          (await import('@src/app/feature/posts')).PostsModule,
      });
    });
  }

  return routes;
  //   return environment.menu.map((item) => {
  //     return {
  //       path: item,
  //       ...canActiveAuthGuard(),
  //       loadChildren: async () =>
  //         (await import('@src/app/feature/posts')).PostsModule,
  //     };
  //   }, {});
}
