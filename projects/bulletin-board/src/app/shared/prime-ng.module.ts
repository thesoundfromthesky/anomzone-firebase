import { NgModule } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MegaMenuModule } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { TabMenuModule } from 'primeng/tabmenu';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InplaceModule } from 'primeng/inplace';
import { SidebarModule } from 'primeng/sidebar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
@NgModule({
  exports: [
    OverlayPanelModule,
    SidebarModule,
    InplaceModule,
    InputTextareaModule,
    ConfirmDialogModule,
    ProgressBarModule,
    TabMenuModule,
    CardModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    MenuModule,
    MenubarModule,
    MegaMenuModule,
    ButtonModule,
    ToolbarModule,
    TableModule,
    InputTextModule,
    DialogModule,
  ],
})
export class PrimeNGModule {}
