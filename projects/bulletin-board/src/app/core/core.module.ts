import {
  NgModule,
  Optional,
  SkipSelf,
  ModuleWithProviders,
} from '@angular/core';
import { configProvider } from './config';
import { errorProvider } from './error';
import { customRouteReuseStategyProvider } from './util/custom-route-reuse-stategy.service';

@NgModule()
export class CoreModule {
  // about singleton service
  // https://angular.io/guide/singleton-services

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        configProvider,
        errorProvider,
        // customRouteReuseStategyProvider,
      ],
    };
  }
}
