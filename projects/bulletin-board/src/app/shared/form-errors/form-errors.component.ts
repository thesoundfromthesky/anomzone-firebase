import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'form-errors',
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorsComponent implements OnInit {
  @Input()
  control!: string;

  @Input()
  form!: FormGroup;

  @Input()
  value!: string;

  constructor() {}

  ngOnInit(): void {}

  isInvalid(errorCode: string, path: string) {
    const formControl = this.form.get(path);
    return (
      (formControl?.touched || formControl?.dirty) &&
      formControl?.getError(errorCode)
    );
  }
}
