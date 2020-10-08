import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './comments.component';
import { CreateComponent } from './create/create.component';
import { SharedModule } from '@src/app/shared';
import { ListComponent } from './list/list.component';
import { GetComponent } from './get/get.component';
import { UpdateComponent } from './update/update.component';

@NgModule({
  declarations: [CommentsComponent, CreateComponent, ListComponent, GetComponent, UpdateComponent],
  imports: [CommonModule, SharedModule],
  exports: [CommentsComponent],
})
export class CommentsModule {}
