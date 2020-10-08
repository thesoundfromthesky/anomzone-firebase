import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { SharedModule } from '@src/app/shared';
import { CallbackComponent } from './callback/callback.component';

@NgModule({
  declarations: [LoginComponent, CallbackComponent],
  imports: [CommonModule, SharedModule],
})
export class AuthModule {}
