import { NgModule } from '@angular/core';
import { SafePipe } from './pipes/safe.pipe';
import { FormModule } from './form.module';
import { PrimeNGModule } from './prime-ng.module';
import { FormErrorsComponent } from './form-errors';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button';
import { AnchorScrollDirective, ControlDirective } from './directives';

@NgModule({
  declarations: [
    SafePipe,
    FormErrorsComponent,
    ButtonComponent,
    ControlDirective,
    AnchorScrollDirective
  ],
  exports: [
    SafePipe,
    FormErrorsComponent,
    ButtonComponent,
    FormModule,
    PrimeNGModule,
    ControlDirective,
    AnchorScrollDirective
  ],
  imports: [CommonModule, PrimeNGModule],
})
export class SharedModule {}
