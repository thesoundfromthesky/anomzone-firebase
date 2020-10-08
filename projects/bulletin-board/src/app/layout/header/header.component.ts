import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
// import { NbMenuItem } from '@nebular/theme';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  // readonly menuItems: NbMenuItem[] = [
  //   {
  //     title: 'Bulletin Board',
  //     link: '/',
  //     home: true,
  //   }
  // ];
  home: MenuItem[] = [];
  items: MenuItem[] = [];

  constructor() {}

  ngOnInit(): void {
    this.home = [
      {
        icon: 'pi pi-home',
        routerLink: ['/'],
        routerLinkActiveOptions: { exact: true },
      },
    ];
    this.items = [
      {
        label: 'File',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            items: [{ label: 'Project' }, { label: 'Other' }],
          },
          { label: 'Open' },
          { label: 'Quit' },
        ],
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          { label: 'Delete', icon: 'pi pi-fw pi-trash' },
          { label: 'Refresh', icon: 'pi pi-fw pi-refresh' },
        ],
      },
    ];
  }
}
