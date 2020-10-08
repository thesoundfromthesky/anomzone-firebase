import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { ConfigService } from './config.service';
import { environment } from '@src/environments/environment';
import { AuthFacadeService } from '@src/app/store/auth';
import { switchMapTo, tap } from 'rxjs/operators';

// https://angular.io/guide/dependency-injection-providers#predefined-tokens-and-multiple-providers
function configFactory(
  http: HttpClient,
  configService: ConfigService,
  authFacadeService: AuthFacadeService
) {
  const configPath = environment.configPath;
  return () => {
    return new Promise<boolean>((resolve, reject) => {
      http
        .get(configPath)
        .pipe(
          tap((res: any) => {
            configService.config = res;
          }),
          switchMapTo(
            authFacadeService.dispatchAuthInitialize$().pipe(
              tap(() => {
                resolve();
              })
            )
          )
        )
        .subscribe({
          error: (err) => reject('Initialize Failed'),
        });
    });
  };
}

export const configProvider = {
  provide: APP_INITIALIZER,
  useFactory: configFactory,
  deps: [HttpClient, ConfigService, AuthFacadeService],
  multi: true,
};
