import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@src/app/shared';
import { ContentComponent } from './content/content.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';

@NgModule({
  declarations: [
    ContentComponent,
    FooterComponent,
    SidebarComponent,
    TopbarComponent,
  ],
  imports: [CommonModule, SharedModule],
  exports: [
    ContentComponent,
    FooterComponent,
    SidebarComponent,
    TopbarComponent,
  ],
})
export class LayoutModule {}
