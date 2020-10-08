import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { GetComponent } from './get/get.component';
import { CreateComponent } from './create/create.component';
import { resolvePostsGet } from '@src/app/store/posts';
import { UpdateComponent } from './update/update.component';

// I'm following firebase rules naming convetion for component's name.
// Collection = more than one data
// Document = single data
export const postRoutes: Routes = [
  { path: '', component: ListComponent },
  { path: 'write', component: CreateComponent },
  {
    path: ':id',
    component: GetComponent,
    ...resolvePostsGet(),
  },
  {
    path: ':id/edit',
    component: UpdateComponent,
    ...resolvePostsGet({ isOwner: true }),    
  },
];

@NgModule({
  imports: [RouterModule.forChild(postRoutes)],
  exports: [RouterModule],
})
export class PostsRoutingModule {}
