import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { MediaBreakpointsService } from '@src/app/core/util';
import { Observable } from 'rxjs';
import { AuthFacadeService, AuthStateModel } from '@src/app/store/auth';
import { LoadingFacadeService } from '@src/app/store/loading';
import { environment } from '@src/environments/environment';
import { Event } from '@angular/router';
import { OverlayPanel } from 'primeng/overlaypanel';

type KeyMenuType = keyof typeof environment.menus;

@Component({
  selector: 'layout-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent implements OnInit {
  menuItems!: MenuItem[];
  megaMenuItems!: MegaMenuItem[];
  activeItem!: MenuItem;
  mb$!: Observable<boolean>;
  user$!: Observable<AuthStateModel>;
  loading$!: Observable<boolean>;
  rs$!: Observable<Event>;
  displaySidebar!: boolean;
  constructor(
    private readonly mbs: MediaBreakpointsService,
    private readonly auth: AuthFacadeService,
    private readonly loading: LoadingFacadeService
  ) {}

  logout(op: OverlayPanel) {
    this.auth.dispatchAuthSignOut$();
    op.hide();
    this.displaySidebar = false;
  }

  ngOnInit(): void {
    this.mb$ = this.mbs.observeBreakpoint('p-lg');
    this.loading$ = this.loading.selectLoading$();
    this.megaMenuItems = this.generateMegaMenu();

    this.user$ = this.auth.selectAuthProfile$();
  }

  generateMegaMenu() {
    const megaMenuItems: MegaMenuItem[] = [];
    const menus = environment.menus;
    for (let menu in menus) {
      const rootStr = this.capitalizeFirstLetter(menu);
      const megaMenuItem: MegaMenuItem = { label: rootStr, items: undefined };

      const menuItemsListSize = 4;
      const menuItemSize = 3;

      const menuItemsList: MenuItem[][] = [];

      let menuItemsCount = 0;

      let menuItem: MenuItem = {};
      let menuItems: MenuItem[] = [];

      menus[menu as KeyMenuType].map((item, index) => {
        const str = this.capitalizeFirstLetter(item);
        if (index % menuItemSize === 0) {
          menuItem = {
            label: rootStr + ' ' + (Math.floor(index / menuItemSize) + 1),
            items: [],
          };

          menuItemsCount = menuItems.push(menuItem);

          if (menuItemsCount % menuItemsListSize === 0) {
            menuItemsList.push(menuItems);
            menuItems = [];
          }
        }

        menuItem.items?.push({
          title: str,
          label: str,
          routerLink: ['/' + item],
          command: () => {
            this.displaySidebar = false;
          },
        });
      });

      if (menuItems.length) {
        menuItemsList.push(menuItems);
      }
      megaMenuItem.items = menuItemsList;
      megaMenuItems.push(megaMenuItem);
    }

    return megaMenuItems;
  }

  // generateMenu() {
  //   return environment.menu.map((item) => {
  //     const str = this.capitalizeFirstLetter(item);
  //     return {
  //       title: str,
  //       label: str,
  //       routerLink: ['/' + item],
  //     };
  //   });
  // }

  capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
