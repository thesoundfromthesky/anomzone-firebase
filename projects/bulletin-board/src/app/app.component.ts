import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterService } from './core/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  router$: Observable<boolean>;

  constructor(private readonly rs: RouterService) {
    this.router$ = this.rs.isLoading$();
  }
}
