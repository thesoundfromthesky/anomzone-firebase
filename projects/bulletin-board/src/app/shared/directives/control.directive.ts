import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appControl]',
})
export class ControlDirective implements OnInit {
  @Input() validators!: any;

  constructor(
    private readonly el: ElementRef,
    private readonly r2: Renderer2
  ) {}
  ngOnInit(): void {
    const id: string = this.el.nativeElement.id;
    const nativeElement: HTMLElement = this.el.nativeElement;
    this.r2.setAttribute(nativeElement, 'type', 'text');
    this.r2.setAttribute(
      nativeElement,
      'aria-label',
      this.capitalizeFirstLetter(id)
    );

    const maxlength = this.validators[id]?.maxlength;
    if (maxlength) {
      this.r2.setAttribute(nativeElement, 'maxlength', maxlength);
    }

    const required = this.validators[id]?.required;
    if (required) {
      this.r2.setAttribute(nativeElement, 'required', "");
    }
  }

  capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
