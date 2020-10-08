import { Injectable } from '@angular/core';
import { Forms } from '../config';
import { ConfigService } from '../config/config.service';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export type KeyForms = keyof Forms;
export type FormsValidators<K extends KeyForms> = Forms[K]['validators'];
export type KeyFormsValidators<
  K extends KeyForms
> = keyof Forms[K]['validators'];
export type FormsDefaults<K extends KeyForms> = Forms[K]['defaults'];
export type KeyFormsDefaults<K extends KeyForms> = keyof Forms[K]['defaults'];

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(
    private readonly configService: ConfigService,
    private readonly fb: FormBuilder
  ) {}

  getFormValidators<K extends KeyForms>(form: K): FormsValidators<K> {
    return this.configService.forms[form].validators;
  }

  getFormDefaults<T extends FormsDefaults<K>, K extends KeyForms>(
    form: K,
    data: T
  ): FormsDefaults<K> {
    const defaults: any = {};

    for (const control in this.configService.forms[form].defaults) {
      defaults[control] = data[control as KeyFormsDefaults<K>];
    }
    return defaults;
  }

  buildValidators(
    formValidators: FormsValidators<KeyForms>,
    control: KeyFormsValidators<KeyForms>
  ): ValidatorFn[] {
    const validators = [];

    if (formValidators[control].maxlength) {
      validators.push(Validators.maxLength(formValidators[control].maxlength));
    }
    if (formValidators[control].required) {
      validators.push(Validators.required);
    }

    return validators;
  }

  buildForm(form: KeyForms, data?: FormsDefaults<typeof form>): FormGroup {
    const formValidators = this.getFormValidators(form);

    const formGroup: any = {};
    for (const control in formValidators) {
      let controlDefault = '';

      if (data?.[control as KeyFormsDefaults<typeof form>]) {
        controlDefault = data[control as KeyFormsDefaults<typeof form>];
      }

      formGroup[control] = [
        controlDefault,
        this.buildValidators(
          formValidators,
          control as KeyFormsValidators<typeof form>
        ),
      ];
    }

    return this.fb.group(formGroup);
  }
}
