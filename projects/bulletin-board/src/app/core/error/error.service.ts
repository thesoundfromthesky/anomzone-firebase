import { Injectable, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Injectable()
export class ErrorService implements ErrorHandler {
  // https://indepth.dev/how-to-avoid-angular-injectable-instances-duplication/
  constructor(
    private readonly ms: MessageService,
    private readonly router: Router,
    private readonly location: Location,
    @Optional() @SkipSelf() parentModule?: ErrorService
  ) {
    if (parentModule) {
      throw Error(
        `[ErrorService]: trying to create multiple instances,
        but this service should be a singleton.`
      );
    }
  }

  handleError(err: any): void {
    const msg: any = {
      severity: 'error',
      summary: err.name,
      detail: err.toString(),
    };
    const lookupTable = {
      [HttpErrorResponse.name]: () => {
        msg.summary = err.statusText;
        msg.detail = err.message;
        const inner: Dictionary<() => void> = {
          404: () => {
            this.toNotFound();
          },
        };

        const status = err.status;
        status in inner && inner[status]();
      },
      ["FirebaseError"]: () => {
        const inner: Dictionary<() => void> = {
          "permission-denied": () => {
            this.toNotFound();
          }
        }

        const code = err.code;
        code in inner && inner[code]();
      },
      default: () => {
        this.toNotFound();
      }
    };

    const name = err.name;
    (lookupTable[name] || lookupTable.default)();

    console.error(err);
    this.ms.add(msg);
  }

  toNotFound() {
    const path = this.location.path();
    this.router.navigateByUrl(`not-found${Date.now()}`, {
      skipLocationChange: true,
    });
    this.location.replaceState(path);
  }
}
