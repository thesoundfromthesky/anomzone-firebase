import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '@src/app/shared';


@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, SharedModule],
})
export class HomeModule {}
