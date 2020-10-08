import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiscellaneousRoutingModule } from './miscellaneous-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { Route } from '@angular/router';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [CommonModule, MiscellaneousRoutingModule],
})
export class MiscellaneousModule {}

export function loadChildrenMiscellaneousModule(): Route {
  return {
    path: '**',
    loadChildren: async () =>
      (await import('@src/app/feature/miscellaneous')).MiscellaneousModule,
  };
}
